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
  RefreshCw
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // ดึงข้อมูลอัปเดตแชทเบื้องหลังทุก 10 วินาที
    const timer = setInterval(() => {
      fetchSessions(true);
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
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h1 className="font-bold text-lg text-slate-800 dark:text-white">ศูนย์ช่วยเหลือลูกค้า LINE OA</h1>
        </div>
        <button
          onClick={() => fetchSessions()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* Main split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Inbox List */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/20 dark:bg-slate-900/20">
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
        <div className="flex-1 flex flex-col bg-slate-50/10 dark:bg-slate-900/10 overflow-hidden">
          {selectedSession ? (
            <>
              {/* Session Control Panel */}
              <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2.5">
                  {selectedSession.linePictureUrl ? (
                    <img 
                      src={selectedSession.linePictureUrl} 
                      alt={selectedSession.lineDisplayName || "LINE User"}
                      className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">
                      {selectedSession.lineDisplayName || "ลูกค้า LINE"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {selectedSession.lineUserId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                            className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
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
      </div>
    </div>
  );
}
