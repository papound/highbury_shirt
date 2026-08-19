"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Terminal as TerminalIcon,
  Download,
  Trash2,
  Play,
  Pause,
  ArrowDown,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface LogLine {
  id: number;
  raw: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SYSTEM" | "UNKNOWN";
  message: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([
    "INFO",
    "WARN",
    "ERROR",
    "SYSTEM",
  ]);
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "paused">("connecting");
  const [autoScroll, setAutoScroll] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const lineCounterRef = useRef(0);

  // Parse log line format: [2026-08-19T14:02:10.123Z] [LEVEL] message
  const parseLogLine = (rawLine: string): LogLine => {
    lineCounterRef.current += 1;
    const match = rawLine.match(/^\[([^\]]+)\]\s+\[([^\]]+)\]\s+(.*)$/);

    if (match) {
      const [, timestamp, rawLevel, message] = match;
      const cleanLevel = rawLevel.toUpperCase();
      let level: LogLine["level"] = "UNKNOWN";

      if (cleanLevel.includes("INFO")) level = "INFO";
      else if (cleanLevel.includes("WARN")) level = "WARN";
      else if (cleanLevel.includes("ERROR")) level = "ERROR";
      else if (cleanLevel.includes("SYSTEM")) level = "SYSTEM";

      return {
        id: lineCounterRef.current,
        raw: rawLine,
        timestamp,
        level,
        message,
      };
    }

    // System message format fallback or unparsed
    let level: LogLine["level"] = "UNKNOWN";
    if (rawLine.includes("[SYSTEM]")) level = "SYSTEM";
    else if (rawLine.includes("[ERROR]")) level = "ERROR";
    else if (rawLine.includes("[WARN]")) level = "WARN";

    return {
      id: lineCounterRef.current,
      raw: rawLine,
      timestamp: new Date().toISOString(),
      level,
      message: rawLine,
    };
  };

  const connectSSE = () => {
    if (isPaused) return;

    setStatus("connecting");
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource("/api/admin/logs/stream");
    eventSourceRef.current = es;

    es.onopen = () => {
      setStatus("connected");
    };

    es.onmessage = (event) => {
      try {
        const rawLine = JSON.parse(event.data);
        const parsed = parseLogLine(rawLine);
        setLogs((prev) => {
          // Prevent memory overflow in browser by capping at 2000 lines
          const next = [...prev, parsed];
          if (next.length > 2000) {
            return next.slice(next.length - 2000);
          }
          return next;
        });
      } catch (err) {
        // Heartbeats or unparsed events
      }
    };

    es.onerror = () => {
      setStatus("disconnected");
      es.close();
      // Retry connection after 5 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          connectSSE();
        }
      }, 5000);
    };
  };

  useEffect(() => {
    connectSSE();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isPaused]);

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  // Handle manual scroll to detect if user scrolled up
  const handleScroll = () => {
    if (!logsContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    // If user scrolled up by more than 50px from bottom, turn off auto-scroll
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    if (!isAtBottom && autoScroll) {
      setAutoScroll(false);
    } else if (isAtBottom && !autoScroll) {
      setAutoScroll(true);
    }
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      setStatus("connecting");
    } else {
      setIsPaused(true);
      setStatus("paused");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    }
  };

  const handleDownload = () => {
    window.open("/api/admin/logs", "_blank");
    toast.success("กำลังดาวน์โหลดไฟล์บันทึกระบบ...");
  };

  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      const res = await fetch("/api/admin/logs", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear logs");
      setLogs([]);
      setConfirmClear(false);
      toast.success("ล้างบันทึกระบบเรียบร้อยแล้ว");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการล้าง log");
    } finally {
      setIsClearing(false);
    }
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const filteredLogs = logs.filter((log) => {
    // Level filter
    if (!selectedLevels.includes(log.level)) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return log.raw.toLowerCase().includes(q);
    }

    return true;
  });

  const getLevelColor = (level: LogLine["level"]) => {
    switch (level) {
      case "INFO":
        return "text-emerald-400";
      case "WARN":
        return "text-amber-400";
      case "ERROR":
        return "text-rose-500 font-bold bg-rose-950/20 px-1 rounded";
      case "SYSTEM":
        return "text-sky-400 font-semibold";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TerminalIcon className="w-6 h-6 text-blue-500" />
            บันทึกการทำงานของระบบ (Application Logs)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ดูและตรวจสอบบันทึกการทำงานของเซิร์ฟเวอร์แบบสด (เฉพาะระดับ Super Admin เท่านั้น)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={togglePause}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 text-emerald-500" />สตรีมต่อ
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 text-amber-500" />หยุดสตรีม
              </>
            )}
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            ดาวน์โหลด Log
          </Button>

          {!confirmClear ? (
            <Button
              onClick={() => setConfirmClear(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash2 className="w-4 h-4" />
              ล้าง Log
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 border border-red-500/30 bg-red-500/10 p-1.5 rounded-lg">
              <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                ยืนยันล้าง?
              </span>
              <Button
                onClick={handleClearLogs}
                disabled={isClearing}
                size="xs"
                variant="destructive"
              >
                ใช่
              </Button>
              <Button
                onClick={() => setConfirmClear(false)}
                disabled={isClearing}
                size="xs"
                variant="ghost"
              >
                ยกเลิก
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Control panel & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-xl bg-card">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">ค้นหาข้อมูลบันทึก</label>
          <Input
            placeholder="พิมพ์คำค้นหา (เช่น API, Order ID, Error)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Level Toggles */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">กรองระดับความสำคัญ</label>
          <div className="flex flex-wrap gap-2">
            {["INFO", "WARN", "ERROR", "SYSTEM"].map((lvl) => {
              const active = selectedLevels.includes(lvl);
              return (
                <button
                  key={lvl}
                  onClick={() => toggleLevel(lvl)}
                  type="button"
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    active
                      ? lvl === "INFO"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : lvl === "WARN"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                        : lvl === "ERROR"
                        ? "bg-red-500/10 border-red-500/30 text-red-500"
                        : "bg-sky-500/10 border-sky-500/30 text-sky-500"
                      : "bg-background border-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status & Options */}
        <div className="flex flex-col justify-end">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground text-xs font-semibold">สถานะเชื่อมต่อ:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  status === "connected"
                    ? "bg-emerald-500 animate-pulse"
                    : status === "connecting"
                    ? "bg-amber-500 animate-pulse"
                    : status === "paused"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              />
              <span className="font-semibold text-xs capitalize">
                {status === "connected"
                  ? "Connected (สตรีมสด)"
                  : status === "connecting"
                  ? "Connecting..."
                  : status === "paused"
                  ? "Paused (หยุดชั่วคราว)"
                  : "Disconnected"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground text-xs font-semibold">จำนวนบันทึก:</span>
            <span className="font-mono text-xs font-semibold">{filteredLogs.length} / {logs.length} บรรทัด</span>
          </div>
        </div>
      </div>

      {/* Terminal logs display */}
      <div className="relative border rounded-xl overflow-hidden bg-slate-950 border-slate-800 shadow-lg">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono font-bold text-slate-400 ml-2">server-app.log</span>
          </div>
          <button
            onClick={() => setAutoScroll((prev) => !prev)}
            className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 font-mono transition-all ${
              autoScroll
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800 text-slate-400 border border-transparent"
            }`}
          >
            <ArrowDown className="w-3 h-3" />
            Auto-Scroll
          </button>
        </div>

        {/* Console Box */}
        <div
          ref={logsContainerRef}
          onScroll={handleScroll}
          className="h-[550px] overflow-y-auto p-4 font-mono text-sm leading-relaxed text-slate-300 scroll-smooth custom-scrollbar flex flex-col space-y-1"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <TerminalIcon className="w-12 h-12 mb-2 text-slate-700 animate-pulse" />
              <p className="text-xs">ยังไม่มีบันทึกข้อมูลการทำงานเข้ามา</p>
              {searchQuery && <p className="text-[11px] mt-1">ลองเปลี่ยนคำค้นหาเพื่อแสดงผลเพิ่มเติม</p>}
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="group flex flex-col md:flex-row md:items-start gap-1 hover:bg-slate-900/60 py-0.5 px-1 rounded transition-colors"
              >
                {/* Timestamp */}
                <span className="text-slate-500 text-xs shrink-0 select-none">
                  {new Date(log.timestamp).toLocaleString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </span>

                {/* Level */}
                <span className={`text-xs w-16 shrink-0 text-center font-bold select-none ${getLevelColor(log.level)}`}>
                  [{log.level}]
                </span>

                {/* Message */}
                <span className="flex-1 whitespace-pre-wrap break-all text-slate-200">
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
