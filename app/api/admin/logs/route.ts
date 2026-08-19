import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import { getLogFilePath } from "@/lib/logger";

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

  if (!fs.existsSync(logFile)) {
    return new Response("Log file not found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(logFile);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="app.log"',
      },
    });
  } catch (err) {
    return new Response(`Error reading log file: ${err}`, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await authorizeSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logFile = getLogFilePath();

  try {
    fs.writeFileSync(
      logFile,
      `[${new Date().toISOString()}] [SYSTEM] Logs cleared by superadmin.\n`,
      "utf8"
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
