import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

// Ensure logs directory exists
if (typeof window === "undefined") {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  // Create the log file if it doesn't exist
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(
      LOG_FILE,
      `[${new Date().toISOString()}] [SYSTEM] Logging initialized.\n`,
      "utf8"
    );
  }
}

function writeLog(level: string, args: any[]) {
  try {
    const timestamp = new Date().toISOString();
    const message = args
      .map((arg) => {
        if (arg instanceof Error) {
          return arg.stack || arg.message;
        }
        return typeof arg === "object" ? JSON.stringify(arg) : String(arg);
      })
      .join(" ");
    const logLine = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, logLine, "utf8");
  } catch (err) {
    // Fallback to original console to avoid infinite loops or silent crashes
    process.stderr.write(`Failed to write log: ${err}\n`);
  }
}

// Intercept console functions once on startup (server-side only)
if (typeof window === "undefined" && !(global as any).__logger_initialized) {
  (global as any).__logger_initialized = true;

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => {
    originalLog(...args);
    writeLog("INFO", args);
  };

  console.error = (...args) => {
    originalError(...args);
    writeLog("ERROR", args);
  };

  console.warn = (...args) => {
    originalWarn(...args);
    writeLog("WARN", args);
  };
}

export function getLogFilePath() {
  return LOG_FILE;
}
