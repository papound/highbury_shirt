"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Send, 
  User as UserIcon, 
  Bot as BotIcon, 
  ShieldAlert, 
  Pause, 
  Play, 
  CheckCircle,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

interface ChatMessage {
  id: string;
  sessionId: string;
  sender: "CUSTOMER" | "BOT" | "ADMIN";
  messageType: string;
  content: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  lineUserId: string;
  lineDisplayName?: string | null;
  linePictureUrl?: string | null;
  requiresAdmin: boolean;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  lastActivity: string;
  messages?: ChatMessage[];
}

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [geminiStats, setGeminiStats] = useState<{
    model: string;
    status: "CONNECTED" | "ERROR" | "MISSING_KEY";
    totalCalls: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCost: number;
    budgetLimit: number;
    creditBalance: number;
    remainingBudget: number;
  } | null>(null);
  const [showGeminiMonitor, setShowGeminiMonitor] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSavingStats, setIsSavingStats] = useState(false);

  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [isFetchingDiagnostic, setIsFetchingDiagnostic] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchGeminiStats = async () => {
    try {
      const res = await fetch("/api/admin/gemini");
      if (res.ok) {
        const data = await res.json();
        setGeminiStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch Gemini stats:", err);
    }
  };

  const handleUpdateGeminiConfig = async (updates: { modelName?: string; budgetLimit?: number; creditBalance?: number }) => {
    setIsSavingStats(true);
    try {
      const res = await fetch("/api/admin/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("อัปเดตการตั้งค่าล้มเหลว");
      toast.success("อัปเดตการตั้งค่า Gemini สำเร็จ");
      fetchGeminiStats();
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSavingStats(false);
    }
  };

  const handleResetGeminiStats = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตสถิติการใช้งานทั้งหมดกลับเป็นศูนย์?")) return;
    
    setIsResetting(true);
    try {
      const res = await fetch("/api/admin/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (!res.ok) throw new Error("รีเซ็ตสถิติล้มเหลว");
      toast.success("รีเซ็ตสถิติการใช้งานเรียบร้อยแล้ว");
      fetchGeminiStats();
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsResetting(false);
    }
  };

  // ดึงรายการ Sessions ทั้งหมด
  const fetchSessions = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch("/api/admin/chats");
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลแชทได้");
      const data = await res.json();
      setSessions(data);

      // อัปเดตข้อมูลของ Session ปัจจุบันที่กำลังเลือกอยู่
      if (selectedSession) {
        const updated = data.find((s: ChatSession) => s.id === selectedSession.id);
        if (updated) {
          setSelectedSession(updated);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาดในการโหลดแชท");
    } finally {
      setIsLoading(false);
    }
  };

  // ดึงประวัติข้อความเมื่อเลือก Session
  const fetchMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/admin/chats/${sessionId}`);
      if (!res.ok) throw new Error("ไม่สามารถโหลดข้อความสนทนาได้");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchGeminiStats();

    // ดึงข้อมูลอัปเดตแชทเบื้องหลังทุก 10 วินาที
    const timer = setInterval(() => {
      fetchSessions(true);
      fetchGeminiStats();
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // เมื่อเลือกแชทใหม่ โหลดข้อความและออโตสกรอลล์ลงล่าง
  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id);
    }
  }, [selectedSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ส่งข้อความพิมพ์ตอบสดของแอดมิน
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/admin/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          text: replyText.trim(),
        }),
      });

      if (!res.ok) throw new Error("ส่งข้อความล้มเหลว");

      const data = await res.json();
      
      // เพิ่มข้อความใหม่ในหน้าจอทันทีเพื่อความรวดเร็ว
      setMessages((prev) => [...prev, data.message]);
      setReplyText("");
      
      // ดึงสเตตัสใหม่ของเซสชั่น (เช่น บอทถูก Pause อัตโนมัติหลังแอดมินตอบ)
      fetchSessions(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  // อัปเดตสถานะของเซสชั่นบอท (Pause / Resume / Complete / requiresAdmin)
  const updateSessionStatus = async (
    updates: { status?: "ACTIVE" | "PAUSED" | "COMPLETED"; requiresAdmin?: boolean }
  ) => {
    if (!selectedSession) return;

    try {
      const res = await fetch(`/api/admin/chats/${selectedSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("อัปเดตสถานะล้มเหลว");
      
      toast.success("อัปเดตสถานะการสนทนาแล้ว");
      fetchSessions(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ดึงข้อมูลวินิจฉัยคลังสินค้า (เช็ค DB) และเปิด Popup Modal
  const handleOpenDiagnostic = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFetchingDiagnostic(true);
    setShowDiagnosticModal(true);
    try {
      const res = await fetch("/api/admin/gemini/diagnostic");
      if (!res.ok) throw new Error("ดึงข้อมูลวินิจฉัยล้มเหลว");
      const data = await res.json();
      setDiagnosticData(data);
    } catch (err: any) {
      toast.error(err.message);
      setShowDiagnosticModal(false);
    } finally {
      setIsFetchingDiagnostic(false);
    }
  };

  // กรองแชทตามข้อความค้นหา
  const filteredSessions = sessions.filter((s) => {
    const term = searchQuery.toLowerCase();
    const matchesId = s.lineUserId.toLowerCase().includes(term);
    const matchesName = s.lineDisplayName?.toLowerCase().includes(term) || false;
    const matchesLastMsg = s.messages?.[0]?.content.toLowerCase().includes(term);
    return matchesId || matchesName || matchesLastMsg;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-4 md:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-blue-600 shrink-0" />
          <h1 className="font-bold text-base md:text-lg text-slate-800 dark:text-white truncate">ศูนย์ช่วยเหลือลูกค้า LINE OA</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Gemini Monitor Toggle */}
          <button
            onClick={() => setShowGeminiMonitor(!showGeminiMonitor)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors flex-1 sm:flex-initial justify-center ${
              showGeminiMonitor
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-950/50 dark:text-blue-400"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <BotIcon className="w-4 h-4" />
            มอนิเตอร์ Gemini
            {geminiStats && (
              <span className={`w-2 h-2 rounded-full ${
                geminiStats.status === "CONNECTED"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-rose-500"
              }`} />
            )}
          </button>

          <button
            onClick={() => fetchSessions()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors flex-1 sm:flex-initial justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            รีเฟรชข้อมูล
          </button>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Inbox List */}
        <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/20 dark:bg-slate-900/20 animate-in fade-in slide-in-from-left-4 duration-300 ${selectedSession ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <input
              type="text"
              placeholder="ค้นหาไลน์ลูกค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {isLoading && sessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">กำลังโหลดข้อมูล...</div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">ไม่มีแชทที่พบ</div>
            ) : (
              filteredSessions.map((sessionItem) => {
                const lastMsg = sessionItem.messages?.[0]?.content || "ไม่มีข้อความ";
                const isSelected = selectedSession?.id === sessionItem.id;
                
                return (
                  <button
                    key={sessionItem.id}
                    onClick={() => setSelectedSession(sessionItem)}
                    className={`w-full p-4 text-left flex flex-col gap-1.5 transition-colors ${
                      isSelected 
                        ? "bg-blue-50/50 dark:bg-blue-950/20" 
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      {sessionItem.linePictureUrl ? (
                        <img 
                          src={sessionItem.linePictureUrl} 
                          alt={sessionItem.lineDisplayName || "LINE User"}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                            {sessionItem.lineDisplayName || `ID: ${sessionItem.lineUserId.substring(0, 8)}`}
                          </span>
                          {sessionItem.requiresAdmin && (
                            <span className="flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded-full">
                              <ShieldAlert className="w-2.5 h-2.5" />
                              ด่วน
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-full">
                      {lastMsg}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        sessionItem.status === "PAUSED" 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" 
                          : sessionItem.status === "COMPLETED" 
                          ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      }`}>
                        {sessionItem.status === "PAUSED" ? "คุยสด" : sessionItem.status === "COMPLETED" ? "จบเคส" : "บอททำงาน"}
                      </span>
                      <span>
                        {new Date(sessionItem.lastActivity).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right side: Chat Thread & Action Controls */}
        <div className={`flex-1 flex flex-col bg-slate-50/10 dark:bg-slate-900/10 overflow-hidden ${selectedSession ? "flex" : "hidden md:flex"}`}>
          {selectedSession ? (
            <>
              {/* Session Control Panel */}
              <div className="px-4 py-3 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex items-center gap-2.5 min-w-0 w-full md:w-auto">
                  {/* Back Button for mobile */}
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {selectedSession.linePictureUrl ? (
                    <img 
                      src={selectedSession.linePictureUrl} 
                      alt={selectedSession.lineDisplayName || "LINE User"}
                      className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-slate-800 dark:text-white truncate">
                      {selectedSession.lineDisplayName || "ลูกค้า LINE"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate">
                      ID: {selectedSession.lineUserId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
                  {/* ปุ่มเปลี่ยนสถานะการหยุดบอท / คุยสด */}
                  {selectedSession.status === "ACTIVE" ? (
                    <button
                      onClick={() => updateSessionStatus({ status: "PAUSED" })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      หยุดบอท (คุยสด)
                    </button>
                  ) : (
                    <button
                      onClick={() => updateSessionStatus({ status: "ACTIVE" })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      เปิดบอทอัตโนมัติ
                    </button>
                  )}

                  {/* ปุ่มอัปเดต ต้องการแอดมิน */}
                  {selectedSession.requiresAdmin ? (
                    <button
                      onClick={() => updateSessionStatus({ requiresAdmin: false })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    >
                      เคลียร์ธงด่วน
                    </button>
                  ) : (
                    <button
                      onClick={() => updateSessionStatus({ requiresAdmin: true })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950/50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                    >
                      ปักธงต้องการดูแลด่วน
                    </button>
                  )}

                  {/* ปุ่มจบแชท */}
                  {selectedSession.status !== "COMPLETED" && (
                    <button
                      onClick={() => updateSessionStatus({ status: "COMPLETED" })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      ปิดดีล/จบเคส
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm py-12">ยังไม่มีประวัติการส่งข้อความ</div>
                ) : (
                  messages.map((msg) => {
                    const isCustomer = msg.sender === "CUSTOMER";
                    const isBot = msg.sender === "BOT";
                    const isImage = msg.messageType === "image";
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[80%] ${
                          isCustomer ? "mr-auto" : "ml-auto flex-row-reverse"
                        }`}
                      >
                        {/* Avatar icon */}
                        {isCustomer && selectedSession.linePictureUrl ? (
                          <img 
                            src={selectedSession.linePictureUrl} 
                            alt={selectedSession.lineDisplayName || "LINE User"}
                            className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm border border-slate-100 dark:border-slate-800"
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                            isCustomer 
                              ? "bg-slate-500" 
                              : isBot 
                              ? "bg-blue-600" 
                              : "bg-amber-600"
                          }`}>
                            {isCustomer ? (
                              <UserIcon className="w-4 h-4" />
                            ) : isBot ? (
                              <BotIcon className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-bold font-mono">AD</span>
                            )}
                          </div>
                        )}

                        {/* Message content bubble */}
                        <div className="flex flex-col gap-1">
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words ${
                              isCustomer
                                ? "bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
                                : isBot
                                ? "bg-blue-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {isImage ? (
                              <div className="space-y-1">
                                <span className="text-xs opacity-80 block mb-1">📷 อัปโหลดรูปภาพ</span>
                                <a 
                                  href={msg.content.replace("Uploaded Image: ", "")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-xs"
                                >
                                  คลิกเพื่อเปิดดูรูปภาพสลิป/หน้าจอ
                                </a>
                              </div>
                            ) : (
                              msg.content
                            )}
                          </div>
                          
                          <span className={`text-[10px] text-slate-400 ${
                            isCustomer ? "text-left" : "text-right"
                          }`}>
                            {msg.sender} • {new Date(msg.createdAt).toLocaleTimeString("th-TH", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Text Area */}
              <form 
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-2"
              >
                <input
                  type="text"
                  placeholder={
                    selectedSession.status === "ACTIVE"
                      ? "พิมพ์ตอบกลับลูกค้าที่นี่... (ส่งข้อความจะเปลี่ยนไปโหมดคุยสดอัตโนมัติ)"
                      : "พิมพ์ข้อความตอบกลับในโหมดคุยสด..."
                  }
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  ส่งแชท
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-center gap-4">
              <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-700" />
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">ไม่มีแชทที่กำลังเลือก</h3>
                <p className="text-sm">กรุณาเลือกช่องแชทจากรายชื่อฝั่งซ้ายมือเพื่อเริ่มการสนทนาหรือตั้งค่าบอท</p>
              </div>
            </div>
          )}
        </div>

        {/* Rightmost column: Gemini Monitor */}
        {showGeminiMonitor && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 md:static md:w-80 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900 md:bg-slate-50/20 md:dark:bg-slate-900/20 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300 shadow-xl md:shadow-none">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <BotIcon className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-sm text-slate-800 dark:text-white">มอนิเตอร์ Gemini</h2>
              </div>
              <button
                onClick={() => setShowGeminiMonitor(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold"
              >
                ปิด
              </button>
            </div>

            {geminiStats ? (
              <div className="p-5 space-y-5">
                {/* Connection Status Card */}
                <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">สถานะการต่อเชื่อม</span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full flex items-center gap-1 ${
                      geminiStats.status === "CONNECTED"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : geminiStats.status === "MISSING_KEY"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        geminiStats.status === "CONNECTED" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                      }`} />
                      {geminiStats.status === "CONNECTED"
                        ? "เชื่อมต่อสำเร็จ"
                        : geminiStats.status === "MISSING_KEY"
                        ? "ขาด API Key"
                        : "ข้อผิดพลาด API"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">โมเดลประมวลผล (Model)</label>
                    <select
                      value={geminiStats.model}
                      onChange={(e) => handleUpdateGeminiConfig({ modelName: e.target.value })}
                      disabled={isSavingStats}
                      className="w-full text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (แนะนำ)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    </select>
                  </div>
                </div>

                {/* Prepay Budget & Credit Card */}
                <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-slate-400">สัดส่วนที่ใช้ไป (Prepay)</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        ฿{Math.max(0, geminiStats.budgetLimit - geminiStats.creditBalance).toFixed(2)} / ฿{geminiStats.budgetLimit.toFixed(2)}
                      </span>
                    </div>
                    
                    {(() => {
                      const spent = Math.max(0, geminiStats.budgetLimit - geminiStats.creditBalance);
                      const percent = Math.min(100, Math.max(0, (spent / geminiStats.budgetLimit) * 100));
                      const isHigh = percent >= 80;
                      const isExceeded = geminiStats.creditBalance <= 0.05;
                      return (
                        <div className="space-y-2">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isExceeded
                                  ? "bg-rose-500"
                                  : isHigh
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-blue-600"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>ใช้ไป {percent.toFixed(1)}%</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              คงเหลือ ฿{geminiStats.creditBalance.toFixed(2)} THB
                            </span>
                          </div>
                          
                          {isExceeded && (
                            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-[10px] p-2.5 rounded-lg border border-rose-100 dark:border-rose-950/50 leading-normal font-medium">
                              ⚠️ ยอดเงิน Credit คงเหลือหมดหรือเหลือน้อยเกินไป บอทจะหยุดตอบอัตโนมัติชั่วคราวและส่งต่อให้มนุษย์ดูแลทันที
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">ซิงค์เงินคงเหลือจริง (Credit Balance)</label>
                        <span className="text-[9px] text-blue-500 font-medium font-mono">฿ THB</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="เช่น 486.48"
                        defaultValue={geminiStats.creditBalance}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0 && val !== geminiStats.creditBalance) {
                            handleUpdateGeminiConfig({ creditBalance: val });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = parseFloat((e.target as HTMLInputElement).value);
                            if (!isNaN(val) && val >= 0) {
                              handleUpdateGeminiConfig({ creditBalance: val });
                              (e.target as HTMLInputElement).blur();
                            }
                          }
                        }}
                        className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">เงินเติมตั้งต้น (Prepay Limit)</label>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        placeholder="เช่น 500"
                        defaultValue={geminiStats.budgetLimit}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0 && val !== geminiStats.budgetLimit) {
                            handleUpdateGeminiConfig({ budgetLimit: val });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = parseFloat((e.target as HTMLInputElement).value);
                            if (!isNaN(val) && val >= 0) {
                              handleUpdateGeminiConfig({ budgetLimit: val });
                              (e.target as HTMLInputElement).blur();
                            }
                          }
                        }}
                        className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* API Request Stats Card */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 block">ตัวเลขสถิติการใช้งาน</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-slate-950 p-3 text-center rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <span className="text-[9px] text-slate-400 block mb-0.5">เรียก API (ครั้ง)</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-white font-mono">
                        {geminiStats.totalCalls.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-950 p-3 text-center rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <span className="text-[9px] text-slate-400 block mb-0.5">โทเค็นสะสม</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-white font-mono">
                        {geminiStats.totalTokens.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tokens นำเข้า (Input)</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                        {geminiStats.inputTokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tokens ประมวลผล (Output)</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                        {geminiStats.outputTokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/40 pt-2 mt-1">
                      <span className="text-slate-400">ประมาณการค่าใช้จ่ายสะสม</span>
                      <span className="font-bold text-slate-800 dark:text-white font-mono">
                        ฿{geminiStats.totalCost.toFixed(4)} THB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reset Stats Control */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleResetGeminiStats}
                    disabled={isResetting}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 dark:border-red-950/30 dark:hover:bg-red-950/20 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    รีเซ็ตประวัติการใช้ API
                  </button>

                  <button
                    onClick={handleOpenDiagnostic}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-lg transition-colors text-center"
                  >
                    🔍 วินิจฉัยคลังสินค้า (เช็ค DB)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">กำลังคำนวณข้อมูล...</div>
            )}
          </div>
        )}
      </div>

      {/* Diagnostic Modal (Popup showing plain text JSON) */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full flex flex-col max-h-[85vh] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                🔍 วินิจฉัยคลังสินค้า (Plain Text JSON)
              </h2>
              <button
                onClick={() => {
                  setShowDiagnosticModal(false);
                  setDiagnosticData(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ปิด
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-950">
              {isFetchingDiagnostic ? (
                <div className="text-center text-slate-400 text-sm py-12">กำลังดึงข้อมูลและวินิจฉัยคลังสินค้า...</div>
              ) : (
                <pre className="text-xs text-emerald-400 font-mono whitespace-pre overflow-x-auto select-all">
                  {diagnosticData ? JSON.stringify(diagnosticData, null, 2) : "ไม่มีข้อมูล"}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
