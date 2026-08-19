import { NextRequest } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import { getLogFilePath } from "@/lib/logger";

export const dynamic = "force-dynamic";

async function authorizeSuperAdmin() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "SUPERADMIN") return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await authorizeSuperAdmin();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const logFile = getLogFilePath();

  // Create stream
  const responseStream = new ReadableStream({
    start(controller) {
      // 1. Send the last 150 lines initially
      if (fs.existsSync(logFile)) {
        try {
          const content = fs.readFileSync(logFile, "utf8");
          const lines = content.split("\n").slice(-150);
          lines.forEach((line) => {
            if (line.trim()) {
              controller.enqueue(`data: ${JSON.stringify(line)}\n\n`);
            }
          });
        } catch (err) {
          controller.enqueue(
            `data: ${JSON.stringify(`[SYSTEM] Error reading initial logs: ${err}`)}\n\n`
          );
        }
      }

      let fileSize = fs.existsSync(logFile) ? fs.statSync(logFile).size : 0;

      // 2. Watch file for updates
      let watcher: fs.FSWatcher | null = null;
      try {
        watcher = fs.watch(logFile, () => {
          try {
            const stats = fs.statSync(logFile);
            if (stats.size > fileSize) {
              const fd = fs.openSync(logFile, "r");
              const buffer = Buffer.alloc(stats.size - fileSize);
              fs.readSync(fd, buffer, 0, stats.size - fileSize, fileSize);
              fs.closeSync(fd);

              fileSize = stats.size;
              const newContent = buffer.toString("utf8");
              const lines = newContent.split("\n");
              lines.forEach((line) => {
                if (line.trim()) {
                  controller.enqueue(`data: ${JSON.stringify(line)}\n\n`);
                }
              });
            } else if (stats.size < fileSize) {
              fileSize = stats.size;
              controller.enqueue(
                `data: ${JSON.stringify("[SYSTEM] Logs cleared or truncated.")}\n\n`
              );
            }
          } catch (e) {
            // Ignore error during read
          }
        });
      } catch (err) {
        controller.enqueue(
          `data: ${JSON.stringify(`[SYSTEM] Error starting file watcher: ${err}`)}\n\n`
        );
      }

      // Heartbeat interval to prevent timeouts
      const interval = setInterval(() => {
        try {
          controller.enqueue(": heartbeat\n\n");
        } catch (e) {
          // Stream might be closed
        }
      }, 15000);

      // Clean up on disconnect
      req.signal.addEventListener("abort", () => {
        if (watcher) {
          watcher.close();
        }
        clearInterval(interval);
        try {
          controller.close();
        } catch (e) {
          // Ignore
        }
      });
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
