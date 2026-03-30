import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Phone,
  Users,
  X,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  PhoneIncoming,
  ChevronLeft,
  Circle,
  Search,
  Volume2
} from "lucide-react";
import { mockChats } from "../data/mockData";
import { useAppContext } from "../hooks/useAppContext";
const CALL_PERMISSIONS = {
  Admin: ["Admin", "HR", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee", "BDE"],
  HR: ["Admin", "HR Head", "Manager", "Employee"],
  "HR Head": ["Admin", "HR", "HR Recruiter", "HR Accountant", "Manager", "Employee"],
  Manager: ["Admin", "HR", "HR Head", "Employee"],
  Employee: ["Manager", "HR", "HR Head"],
  BDE: ["Manager", "Admin"],
  "HR Recruiter": ["HR Head", "Manager", "Admin"],
  "HR Accountant": ["HR Head", "Manager", "Admin"]
};
function CommunicationPanel() {
  const { currentUser, userRole, employees } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [chats, setChats] = useState(mockChats);
  const [activeChat, setActiveChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [inCall, setInCall] = useState(false);
  const [callTarget, setCallTarget] = useState(null);
  const [callStatus, setCallStatus] = useState("calling");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);
  useEffect(() => {
    if (inCall && callStatus === "connected") {
      timerRef.current = setInterval(() => setCallTimer((t) => t + 1), 1e3);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inCall, callStatus]);
  useEffect(() => {
    if (isOpen && !incomingCall && !inCall) {
      const t = setTimeout(() => {
        setIncomingCall({ callerId: "EMP-1006", callerName: "Karan Malhotra", callerRole: "Engineering Manager" });
      }, 6e3);
      return () => clearTimeout(t);
    }
  }, [isOpen]);
  const sendMessage = () => {
    if (!messageText.trim() || !activeChat) return;
    const msg = { id: `m${Date.now()}`, senderId: "me", text: messageText.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: true };
    setChats((prev) => prev.map((c) => c.id === activeChat.id ? { ...c, messages: [...c.messages, msg] } : c));
    setActiveChat((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
    setMessageText("");
    setTimeout(() => {
      const replies = ["Thanks! Got it \u{1F44D}", "Sure, I will take a look.", "On it!", "Noted. Will update you soon.", "Perfect, thanks!"];
      const reply = { id: `m${Date.now()}r`, senderId: activeChat.id, text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: true };
      setChats((prev) => prev.map((c) => c.id === activeChat.id ? { ...c, messages: [...c.messages, reply] } : c));
      setActiveChat((prev) => prev ? { ...prev, messages: [...prev.messages, reply] } : prev);
    }, 1500);
  };
  const startCall = (name, role) => {
    setCallTarget({ name, role });
    setCallStatus("calling");
    setInCall(true);
    setIsMuted(false);
    setIsVideoOff(false);
    setTimeout(() => setCallStatus("connected"), 2500);
  };
  const endCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      setInCall(false);
      setCallTarget(null);
    }, 800);
  };
  const acceptCall = () => {
    if (!incomingCall) return;
    setCallTarget({ name: incomingCall.callerName, role: incomingCall.callerRole });
    setIncomingCall(null);
    setCallStatus("connected");
    setInCall(true);
  };
  const rejectCall = () => setIncomingCall(null);
  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const canCallRole = (targetRole) => {
    const allowed = CALL_PERMISSIONS[userRole || "Employee"] || [];
    return allowed.includes(targetRole);
  };
  const callableEmployees = employees.filter((e) => e.id !== currentUser?.id && canCallRole(e.role));
  const filteredChats = chats.filter((c) => c.name.toLowerCase().includes(chatSearch.toLowerCase()));
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);
  const TABS = [
    { id: "chat", icon: MessageSquare, badge: totalUnread },
    { id: "call", icon: Phone, badge: 0 },
    { id: "online", icon: Users, badge: 0 }
  ];
  return <>
      {
    /* ── INCOMING CALL POPUP ────────────────────────────────────────────── */
  }
      <AnimatePresence>
        {incomingCall && <motion.div
    initial={{ opacity: 0, y: 80, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 80, scale: 0.9 }}
    className="fixed bottom-6 right-6 z-[200] w-80 bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 p-5 flex flex-col gap-4"
  >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg">
                  {incomingCall.callerName.charAt(0)}
                </div>
                <motion.div
    animate={{ scale: [1, 1.4, 1] }}
    transition={{ repeat: Infinity, duration: 1.2 }}
    className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 shadow"
  />
              </div>
              <div>
                <p className="font-black text-white">{incomingCall.callerName}</p>
                <p className="text-xs text-slate-400">{incomingCall.callerRole}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Volume2 size={11} className="text-emerald-400" />
                  <span className="text-[11px] text-emerald-400 font-bold">Incoming Call...</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={rejectCall}
    className="flex-1 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-500/30 transition-colors"
  >
                <PhoneOff size={15} /> Reject
              </motion.button>
              <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={acceptCall}
    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
  >
                <PhoneIncoming size={15} /> Accept
              </motion.button>
            </div>
          </motion.div>}
      </AnimatePresence>

      {
    /* ── ACTIVE CALL MODAL ─────────────────────────────────────────────── */
  }
      <AnimatePresence>
        {inCall && callTarget && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[190] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl"
  >
            <motion.div
    initial={{ scale: 0.85, y: 30 }}
    animate={{ scale: 1, y: 0 }}
    exit={{ scale: 0.85, y: 30 }}
    className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-6"
  >
              {
    /* Avatar */
  }
              <div className="relative">
                <motion.div
    animate={callStatus === "calling" ? { scale: [1, 1.08, 1] } : {}}
    transition={{ repeat: Infinity, duration: 2 }}
    className="w-24 h-24 rounded-full bg-cyan-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-cyan-500/30"
  >
                  {callTarget.name.charAt(0)}
                </motion.div>
                {callStatus === "connected" && <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900" />}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-black text-white">{callTarget.name}</h3>
                <p className="text-slate-400 text-sm">{callTarget.role}</p>
                <p className={`text-sm font-bold mt-1 ${callStatus === "connected" ? "text-emerald-400" : "text-amber-400"}`}>
                  {callStatus === "calling" ? "\u{1F514} Calling..." : callStatus === "connected" ? `\u{1F7E2} Connected \xB7 ${formatTimer(callTimer)}` : "\u{1F4F4} Call ended"}
                </p>
              </div>

              {
    /* Controls */
  }
              <div className="flex items-center gap-5">
                <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsMuted(!isMuted)}
    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isMuted ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
  >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </motion.button>
                <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={endCall}
    className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/40 hover:bg-rose-600 transition-colors"
  >
                  <PhoneOff size={26} />
                </motion.button>
                <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsVideoOff(!isVideoOff)}
    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isVideoOff ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
  >
                  {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {
    /* ── FLOATING ICON BAR ─────────────────────────────────────────────── */
  }
      {!isOpen && <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    className="fixed right-4 top-1/2 -translate-y-1/2 z-[150] flex flex-col gap-2"
  >
          {TABS.map((t) => <motion.button
    key={t.id}
    whileHover={{ scale: 1.12, x: -4 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      setTab(t.id);
      setIsOpen(true);
    }}
    className="relative w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-700 transition-all"
  >
              <t.icon size={18} />
              {t.badge > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-black rounded-full px-1 flex items-center justify-center shadow">
                  {t.badge}
                </span>}
            </motion.button>)}
        </motion.div>}

      {
    /* ── PANEL ─────────────────────────────────────────────────────────── */
  }
      <AnimatePresence>
        {isOpen && <motion.div
    initial={{ opacity: 0, x: 380 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 380 }}
    transition={{ type: "spring", stiffness: 280, damping: 30 }}
    className="fixed right-0 top-0 h-full w-[360px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-2xl z-[150] flex flex-col"
  >
            {
    /* Panel Header */
  }
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex gap-1">
                {TABS.map((t) => <button
    key={t.id}
    onClick={() => setTab(t.id)}
    className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${tab === t.id ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
  >
                    <t.icon size={13} />
                    <span className="capitalize">{t.id === "call" ? "Calls" : t.id === "online" ? "Team" : "Chat"}</span>
                    {t.badge > 0 && <span className="min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-black rounded-full px-1 flex items-center justify-center">
                        {t.badge}
                      </span>}
                  </button>)}
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
                <X size={16} />
              </button>
            </div>

            {
    /* ── CHAT TAB ─────────────────────────────────────────────────── */
  }
            {tab === "chat" && <>
                {!activeChat ? <div className="flex-1 flex flex-col min-h-0">
                    {
    /* Search */
  }
                    <div className="p-3 border-b border-slate-50 dark:border-slate-800">
                      <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={14} />
                        <input
    value={chatSearch}
    onChange={(e) => setChatSearch(e.target.value)}
    placeholder="Search conversations..."
    className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-[13px] bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 outline-none border border-transparent focus:bg-white focus:border-[#0f4184] focus:ring-[3px] focus:ring-[#0f4184]/10 transition-all duration-300 shadow-sm"
  />
                        {chatSearch && (
                          <button
                            onClick={() => setChatSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {
    /* Contact list */
  }
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {filteredChats.map((contact) => <motion.button
    key={contact.id}
    whileHover={{ backgroundColor: "rgba(99,102,241,0.05)" }}
    onClick={() => {
      setActiveChat(contact);
      setChats((prev) => prev.map((c) => c.id === contact.id ? { ...c, unread: 0 } : c));
    }}
    className="w-full flex items-center gap-3 p-3.5 border-b border-slate-50 dark:border-slate-800/50 text-left transition-colors"
  >
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-600 flex items-center justify-center text-white text-sm font-black shadow-sm">
                              {contact.name.charAt(0)}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${contact.online ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{contact.name}</p>
                              <span className="text-[10px] text-slate-400 shrink-0 ml-2">{contact.messages.slice(-1)[0]?.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">{contact.messages.slice(-1)[0]?.text || "No messages"}</p>
                          </div>
                          {contact.unread > 0 && <span className="min-w-[18px] h-[18px] bg-cyan-600 text-white text-[10px] font-black rounded-full px-1 flex items-center justify-center shrink-0">
                              {contact.unread}
                            </span>}
                        </motion.button>)}
                    </div>
                  </div> : <div className="flex-1 flex flex-col min-h-0">
                    {
    /* Chat header */
  }
                    <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                      <button onClick={() => setActiveChat(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <ChevronLeft size={16} />
                      </button>
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white text-xs font-black">
                          {activeChat.name.charAt(0)}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${activeChat.online ? "bg-emerald-400" : "bg-slate-300"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">{activeChat.name}</p>
                        <p className="text-[10px] text-slate-400">{activeChat.online ? "Online" : `Last seen ${activeChat.lastSeen}`}</p>
                      </div>
                      <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => startCall(activeChat.name, activeChat.role)}
    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
  >
                        <Phone size={14} />
                      </motion.button>
                    </div>
                    {
    /* Messages */
  }
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                      {activeChat.messages.map((msg) => <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"} gap-2`}>
                          {msg.senderId !== "me" && <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[9px] font-black shrink-0 mt-auto">
                              {activeChat.name.charAt(0)}
                            </div>}
                          <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${msg.senderId === "me" ? "bg-cyan-600 text-white rounded-br-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-sm"}`}>
                            <p className="leading-relaxed">{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.senderId === "me" ? "text-cyan-200 text-right" : "text-slate-400"}`}>{msg.time}</p>
                          </div>
                        </div>)}
                      <div ref={chatEndRef} />
                    </div>
                    {
    /* Input */
  }
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0">
                      <input
    value={messageText}
    onChange={(e) => setMessageText(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    placeholder="Type a message..."
    className="flex-1 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 outline-none border border-transparent focus:border-cyan-300 dark:focus:border-cyan-700 transition-all"
  />
                      <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={sendMessage}
    disabled={!messageText.trim()}
    className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md disabled:opacity-40 hover:bg-cyan-700 transition-colors"
  >
                        <Send size={14} />
                      </motion.button>
                    </div>
                  </div>}
              </>}

            {
    /* ── CALL TAB ─────────────────────────────────────────────────── */
  }
            {tab === "call" && <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Callable Contacts</p>
                {callableEmployees.length === 0 && <div className="py-12 text-center text-slate-400">
                    <Phone size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No contacts available</p>
                  </div>}
                {callableEmployees.map((emp, i) => <motion.div
    key={emp.id}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }}
    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-1"
  >
                    <div className="w-10 h-10 rounded-2xl bg-cyan-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{emp.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{emp.role} · {emp.department}</p>
                    </div>
                    <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => startCall(emp.name, emp.role)}
    className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
  >
                      <Phone size={14} />
                    </motion.button>
                  </motion.div>)}
              </div>}

            {
    /* ── ONLINE USERS TAB ─────────────────────────────────────────── */
  }
            {tab === "online" && <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">
                  Team — {employees.length} members
                </p>
                <div className="space-y-1">
                  {employees.filter((e) => e.id !== currentUser?.id).map((emp, i) => {
    const isOnline = mockChats.some((c) => c.id === emp.id && c.online) || Math.random() > 0.5;
    return <motion.div
      key={emp.id}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.04 }}
      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
    >
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                            {emp.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${isOnline ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-slate-800 dark:text-white truncate">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{emp.role} · {isOnline ? <span className="text-emerald-500">Online</span> : <span>Offline</span>}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
      onClick={() => {
        const c = chats.find((ch) => ch.id === emp.id);
        if (c) {
          setActiveChat(c);
          setTab("chat");
        }
      }}
      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
    >
                            <MessageSquare size={13} />
                          </button>
                          {canCallRole(emp.role) && <button
      onClick={() => startCall(emp.name, emp.role)}
      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
    >
                              <Phone size={13} />
                            </button>}
                        </div>
                      </motion.div>;
  })}
                </div>
              </div>}

            {
    /* Online indicator bar at bottom */
  }
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Circle size={8} className="text-emerald-400 fill-emerald-400" />
                <span className="text-[11px] text-slate-500">You appear as <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser?.name}</span></span>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </>;
}
export default CommunicationPanel;
