import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, MessageSquare, BarChart3, FolderKanban, Phone, Users, ChevronRight, Shield } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logoUrl from "../assets/logo.jpg";
const DEMO_ACCOUNTS = [
    { role: "Admin", email: "admin@hrm.com", color: "bg-cyan-600", icon: Shield },
    { role: "HR", email: "hrrecruiter@hrm.com", color: "bg-cyan-500", icon: Users },
    { role: "Manager", email: "manager@hrm.com", color: "bg-cyan-400", icon: BarChart3 },
    // { role: "BDE", email: "bde@hrm.com", color: "from-blue-500 to-cyan-500", icon: BarChart3 }
];
const FEATURES = [
    { icon: Users, label: "Team HRM", sub: "Manage people & roles" },
    { icon: MessageSquare, label: "Team Chat", sub: "Chat & voice calls" },
    { icon: FolderKanban, label: "Projects & CRM", sub: "Track deals & projects" },
    { icon: BarChart3, label: "Analytics", sub: "Real-time dashboards" },
    { icon: Phone, label: "In-App Calls", sub: "Call colleagues directly" }
];
const BLOBS = [
    { cx: "15%", cy: "20%", r: 180, delay: 0, dur: 7 },
    { cx: "80%", cy: "70%", r: 220, delay: 1.5, dur: 9 },
    { cx: "60%", cy: "15%", r: 130, delay: 0.8, dur: 6 },
    { cx: "10%", cy: "80%", r: 160, delay: 2, dur: 8 }
];
function Login() {
    const { login, employees } = useAppContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e?.preventDefault();
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
            toast.success("Welcome back! \u{1F44B}");
            navigate("/");
        } else {
            toast.error("Invalid credentials", { description: res.error || "Please check your email and password" });
        }
    };
    const fillDemo = (demoEmail) => {
        setEmail(demoEmail);
        setPassword("password123");
    };
    return <div className="h-screen flex overflow-hidden bg-[#09090f]">
        {
            /* ── LEFT PANEL ─────────────────────────────────────────────────────── */
        }
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col w-[58%] relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0f1120 0%, #0d1a2e 50%, #0c0f1f 100%)" }}
        >
            {
                /* Animated blobs */
            }
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="blur-blob">
                        <feGaussianBlur stdDeviation="60" />
                    </filter>
                </defs>
                {BLOBS.map((b, i) => <motion.circle
                    key={i}
                    cx={b.cx}
                    cy={b.cy}
                    r={b.r}
                    fill={i % 2 === 0 ? "#0891b220" : "#0d948815"}
                    filter="url(#blur-blob)"
                    animate={{ cx: [b.cx, `calc(${b.cx} + 40px)`, b.cx], cy: [b.cy, `calc(${b.cy} - 30px)`, b.cy] }}
                    transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
                />)}
            </svg>

            {
                /* Grid pattern overlay */
            }
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />

            {
                /* Content */
            }
            <div className="relative z-10 flex flex-col h-full p-12">
                {
                    /* Logo */
                }
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mb-16"
                >
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-cyan-500/30 shadow-lg">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <span className="text-xl font-black text-white tracking-tight">Nexi<span className="text-cyan-400">5</span></span>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Enterprise Platform</p>
                    </div>
                </motion.div>

                {
                    /* Hero text */
                }
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                        Your entire<br />
                        <span className="text-transparent bg-clip-text gradient-bg-primary">
                            company in one
                        </span><br />
                        platform.
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                        HR management, team communication, project tracking, and CRM — unified for modern teams.
                    </p>
                </motion.div>

                {
                    /* Features list */
                }
                <div className="flex flex-col gap-3 mb-auto">
                    {FEATURES.map((f, i) => <motion.div
                        key={f.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm hover:bg-white/[0.06] transition-all group cursor-default"
                    >
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/25 transition-colors">
                            <f.icon size={16} className="text-cyan-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">{f.label}</p>
                            <p className="text-[11px] text-slate-500">{f.sub}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </motion.div>)}
                </div>

                {
                    /* Footer */
                }
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-[11px] text-slate-600"
                >
                    © 2025 Nexi5 Technologies · All rights reserved
                </motion.p>
            </div>
        </motion.div>

        {
            /* ── RIGHT PANEL ────────────────────────────────────────────────────── */
        }
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-950 relative overflow-auto py-10 px-6"
        >
            {
                /* Mobile logo */
            }
            <div className="flex lg:hidden items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-cyan-200">
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-black text-slate-800 dark:text-white">Nexi<span className="text-cyan-500">5</span></span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[400px]"
            >
                {
                    /* Header */
                }
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sign in</h2>
                    <p className="text-slate-400 text-sm mt-1">Access your workspace and team</p>
                </div>

                {
                    /* Form */
                }
                <form onSubmit={handleLogin} className="space-y-4">
                    {
                        /* Email */
                    }
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 dark:focus:border-cyan-500"
                        />
                    </div>

                    {
                        /* Password */
                    }
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 dark:focus:border-cyan-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {
                        /* Remember me */
                    }
                    <div className="flex items-center gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={() => setRemember(!remember)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${remember ? "bg-cyan-600 border-cyan-600" : "border-slate-300 dark:border-slate-600 hover:border-cyan-400"}`}
                        >
                            {remember && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>}
                        </button>
                        <span className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer" onClick={() => setRemember(!remember)}>
                            Remember me for 30 days
                        </span>
                        <button type="button" className="ml-auto text-xs font-semibold text-cyan-500 hover:text-cyan-700 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    {
                        /* Submit */
                    }
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 mt-2 gradient-bg-primary hover:shadow-cyan-500/25 transition-all"
                    >
                        {loading ? <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        /> : "Sign in to Workspace"}
                    </motion.button>
                </form>

                {
                    /* Demo accounts */
                }
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Demo Accounts</span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                        {DEMO_ACCOUNTS.filter((d) => employees.some((e) => e.email === d.email)).map((d) => <motion.button
                            key={d.role}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => fillDemo(d.email)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-cyan-200 dark:hover:border-cyan-800 hover:bg-white dark:hover:bg-slate-900 transition-all text-left group"
                        >
                            <div className={`w-7 h-7 rounded-lg ${d.color} flex items-center justify-center shrink-0 shadow-sm`}>
                                <d.icon size={13} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{d.role}</p>
                                <p className="text-[10px] text-slate-400">Click to fill</p>
                            </div>
                        </motion.button>)}
                    </div>
                    <p className="text-center text-[11px] text-slate-400 mt-3">Password: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">password123</span></p>
                </div>
            </motion.div>
        </motion.div>

        {
            /* Global AnimatePresence for any modals launched from here */
        }
        <AnimatePresence />
    </div>;
}
export {
    Login as default
};
