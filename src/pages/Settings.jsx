import { useState } from "react";
import { Save, User, Lock, Bell, Building, Globe, ShieldCheck, Mail, MapPin, Key, Fingerprint, Loader2, RefreshCw, ChevronRight, Smartphone, AlertTriangle, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [saving, setSaving] = useState(false);
    const [accountForm, setAccountForm] = useState({
        email: "admin@hrm.com",
        phone: "+91 80 4567 8910",
        name: "Ananya Iyer",
        timezone: "Asia/Kolkata"
    });
    const [security, setSecurity] = useState([
        { title: "Two-Factor Authentication (MFA)", desc: "Requires a secondary verification code on login.", icon: Fingerprint, enabled: true },
        { title: "Biometric Access", desc: "Enable FaceID or Fingerprint login on mobile.", icon: ShieldCheck, enabled: false },
        { title: "IP Whitelisting", desc: "Restrict login access to corporate IP ranges only.", icon: Globe, enabled: false },
        { title: "Automatic Session Timeout", desc: "Log out after 30 minutes of inactivity.", icon: Lock, enabled: true }
    ]);
    const [notifs, setNotifs] = useState([
        { label: "Leave Applications", email: true, push: true },
        { label: "Task Deadlines", email: true, push: false },
        { label: "Payroll Disbursal", email: true, push: true },
        { label: "Holiday Announcements", email: false, push: true },
        { label: "New Employee Joins", email: true, push: false },
        { label: "System Updates", email: false, push: false }
    ]);
    const toggleSecurity = (i) => {
        setSecurity((prev) => prev.map((s, idx) => idx === i ? { ...s, enabled: !s.enabled } : s));
        const updated = !security[i].enabled;
        toast[updated ? "success" : "info"](`${security[i].title} ${updated ? "enabled" : "disabled"}`);
    };
    const toggleNotif = (i, type) => {
        setNotifs((prev) => prev.map((n, idx) => idx === i ? { ...n, [type]: !n[type] } : n));
    };
    const handleSave = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1500));
        setSaving(false);
        toast.success("Settings saved!", { description: "All your changes have been applied." });
    };
    const tabs = [
        { id: "profile", name: "Company Profile", icon: Building },
        { id: "account", name: "Account Settings", icon: User },
        { id: "security", name: "Security & Access", icon: ShieldCheck },
        { id: "notifications", name: "Push & Alerts", icon: Bell }
    ];
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <ChevronRight size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Platform Settings</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Fine-tune your workspace preferences and security protocols.</p>
            </div>
            <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm disabled:opacity-70 bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
            >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? "Syncing Changes..." : "Apply Changes"}
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {
                /* Sidebar Tabs */
            }
            <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
                <div className="bg-white p-3 rounded-[32px] border border-gray-100 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                    flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 text-[11px] font-bold uppercase tracking-widest group w-full text-left
                    ${isActive ? "bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white shadow-md shadow-primary/20 scale-[1.02]" : "text-textSecondary hover:text-textPrimary hover:bg-gray-50"}
                  `}
                        >
                            <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-gray-50 group-hover:bg-primary/10 text-textSecondary group-hover:text-primary border border-gray-100/50"}`}>
                                <Icon size={18} />
                            </div>
                            {tab.name}
                            {isActive && <motion.div layoutId="tab-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
                        </button>;
                    })}
                </div>

                {
                    /* Quick Context Card */
                }
                <div className="hidden lg:block bg-gradient-to-br from-secondary to-[#0b3166] p-6 rounded-[32px] text-white overflow-hidden relative shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
                    <ShieldCheck className="text-primary mb-4" size={36} strokeWidth={1.5} />
                    <h4 className="text-xs font-bold uppercase tracking-widest leading-tight">Platform Integrity</h4>
                    <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-tighter opacity-90">Security Health: 92% Secure</p>
                    <div className="mt-5 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-primary shadow-[0_0_12px_#0f4184]" transition={{ delay: 0.5, duration: 1 }} />
                    </div>
                    <button className="mt-8 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-white transition-all flex items-center gap-2 group">
                        Start Security Audit <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {
                /* Content Panel */
            }
            <div className="flex-1 flex flex-col min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-5 md:p-10 flex-1 overflow-y-auto custom-scrollbar relative"
                    >
                        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                        {activeTab === "profile" && <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-textPrimary leading-tight">Identity & Branding</h3>
                                        <p className="text-xs font-bold text-textSecondary mt-1.5 uppercase tracking-widest">Global information for your organization</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { label: "Organization Name", defaultValue: "Enterprise HR Solutions", icon: Building },
                                        { label: "Industry", defaultValue: "Software Development", icon: Laptop },
                                        { label: "Tax ID (GST)", defaultValue: "29ABCDE1234F1Z5", icon: ShieldCheck },
                                        { label: "PAN Number", defaultValue: "ABCDE1234F", icon: Key }
                                    ].map((f) => <div key={f.label} className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">{f.label}</label>
                                        <div className="relative group">
                                            <f.icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                            <input type="text" defaultValue={f.defaultValue} className="input-base pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium text-textPrimary" />
                                        </div>
                                    </div>)}
                                </div>
                            </section>

                            <section className="pt-12 border-t border-gray-50">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-textPrimary leading-tight">HQ Location</h3>
                                        <p className="text-xs font-bold text-textSecondary mt-1.5 uppercase tracking-widest">Primary office address for billing</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Full Address</label>
                                        <input type="text" defaultValue="Block 4, Outer Ring Road, Manyata Tech Park" className="input-base h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium text-textPrimary px-6" />
                                    </div>
                                    {[
                                        { label: "City", value: "Bangalore" },
                                        { label: "State", value: "Karnataka" },
                                        { label: "PIN Code", value: "560045" },
                                        { label: "Country", value: "India" }
                                    ].map((f) => <div key={f.label} className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">{f.label}</label>
                                        <input type="text" defaultValue={f.value} className="input-base h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium text-textPrimary px-6" />
                                    </div>)}
                                </div>
                            </section>
                        </div>}

                        {
                            /* ---- Account Settings ---- */
                        }
                        {activeTab === "account" && <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-textPrimary leading-tight">Personal Details</h3>
                                        <p className="text-xs font-bold text-textSecondary mt-1.5 uppercase tracking-widest">Update your contact info and avatar</p>
                                    </div>
                                </div>

                                {
                                    /* Avatar Upgrade */
                                }
                                <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 p-5 sm:p-8 mb-8 sm:mb-12 bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-[#0f4184] to-[#0b3166] flex items-center justify-center text-white text-2xl sm:text-4xl font-bold shadow-2xl group-hover:scale-105 transition-transform border-4 border-white shrink-0">
                                        {accountForm.name.charAt(0)}
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-lg sm:text-xl font-bold text-textPrimary leading-none">{accountForm.name}</h4>
                                        <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest mt-2 sm:mt-3 flex items-center gap-2">
                                            <ShieldCheck size={12} className="text-primary" /> System Super-Admin • ID: #ADMIN-2024
                                        </p>
                                        <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 flex-wrap">
                                            <button onClick={() => toast.info("File browser opened")} className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-textPrimary text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all hover:border-primary/20">Update Photo</button>
                                            <button className="text-[11px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">Remove Avatar</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Full Name Address</label>
                                        <input type="text" value={accountForm.name} onChange={(e) => setAccountForm((p) => ({ ...p, name: e.target.value }))} className="input-base h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium text-textPrimary px-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Primary Email</label>
                                        <div className="relative group">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                            <input type="email" value={accountForm.email} onChange={(e) => setAccountForm((p) => ({ ...p, email: e.target.value }))} className="input-base pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium text-textPrimary" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Work Mobile</label>
                                        <div className="relative group">
                                            <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                            <input type="text" value={accountForm.phone} onChange={(e) => setAccountForm((p) => ({ ...p, phone: e.target.value }))} className="input-base pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium text-textPrimary" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">System Timezone</label>
                                        <div className="relative">
                                            <select value={accountForm.timezone} onChange={(e) => setAccountForm((p) => ({ ...p, timezone: e.target.value }))} className="input-base h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium text-textPrimary px-6 appearance-none cursor-pointer">
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST UTC+5:30)</option>
                                                <option value="Asia/Mumbai">Asia/Mumbai</option>
                                                <option value="UTC">UTC Standard</option>
                                            </select>
                                            <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-textSecondary rotate-90 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="pt-12 border-t border-gray-50 p-8 bg-gray-50 rounded-[32px]">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <Key size={18} className="text-secondary" />
                                        <div>
                                            <h3 className="text-base font-bold text-textPrimary leading-none">Core Credentials</h3>
                                            <p className="text-[10px] font-bold text-textSecondary mt-2 uppercase tracking-widest">Update your platform access password</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="input-base h-14 rounded-2xl bg-white border-gray-100 font-medium px-6 focus:border-primary/50 transition-all" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">New Secure Password</label>
                                        <input type="password" placeholder="Enter min. 10 characters" className="input-base h-14 rounded-2xl bg-white border-gray-100 font-medium px-6 focus:border-primary/50 transition-all" />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button onClick={() => toast.success("Syncing credentials...")} className="px-8 py-3 bg-secondary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-95 transition-all flex items-center gap-3 shadow-md border border-white/10">
                                        <RefreshCw size={16} /> Sync New Password
                                    </button>
                                </div>
                            </section>
                        </div>}

                        {
                            /* ---- Security & Roles ---- */
                        }
                        {activeTab === "security" && <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-textPrimary leading-tight">Advanced Guardrails</h3>
                                        <p className="text-xs font-bold text-textSecondary mt-1.5 uppercase tracking-widest">Enable enterprise-grade security features</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    {security.map((item, i) => <motion.div
                                        key={i}
                                        whileHover={{ x: 6, backgroundColor: "#F9FAFC" }}
                                        className="flex items-center justify-between p-6 rounded-[28px] border border-gray-100 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shadow-inner border border-primary/10">
                                                <item.icon size={26} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-bold text-textPrimary">{item.title}</p>
                                                <p className="text-[11px] font-bold text-textSecondary mt-2 tracking-wide uppercase opacity-70">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleSecurity(i)}
                                            className={`relative w-14 h-7.5 rounded-full transition-all duration-500 flex items-center px-1.5 ${item.enabled ? "bg-primary shadow-[0_0_12px_rgba(34,193,220,0.5)]" : "bg-gray-200"}`}
                                        >
                                            <motion.div
                                                animate={{ x: item.enabled ? 24 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="w-5.5 h-5.5 bg-white rounded-full shadow-lg"
                                            />
                                        </button>
                                    </motion.div>)}
                                </div>
                            </section>

                            <section className="pt-12 border-t border-gray-50">
                                <div className="flex items-center gap-3 mb-8">
                                    <AlertTriangle size={20} className="text-rose-500" />
                                    <h4 className="text-[11px] font-bold text-textPrimary uppercase tracking-widest">Protocol Override (Danger Zone)</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "#FFF1F2" }}
                                        onClick={() => toast.error("All sessions revoked.")}
                                        className="flex flex-col items-start p-6 rounded-[32px] border border-rose-100 bg-rose-50/30 text-left transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                                            <Lock size={20} />
                                        </div>
                                        <span className="text-[11px] font-bold text-rose-700 uppercase tracking-widest">Force Global Sign-out</span>
                                        <span className="text-[10px] font-bold text-rose-500/80 mt-2 leading-relaxed">Disconnect every active user session immediately. This cannot be undone.</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "#FFFBEB" }}
                                        onClick={() => toast.info("System locked for maintenance")}
                                        className="flex flex-col items-start p-6 rounded-[32px] border border-amber-100 bg-amber-50/30 text-left transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">Maintenance Mode</span>
                                        <span className="text-[10px] font-bold text-amber-600/80 mt-2 leading-relaxed">Limit platform access to technical administrators for system upgrades.</span>
                                    </motion.button>
                                </div>
                            </section>
                        </div>}

                        {
                            /* ---- Notifications ---- */
                        }
                        {activeTab === "notifications" && <div className="space-y-12">
                            <section>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                                            <Bell size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-textPrimary leading-tight">Dispatch Rules</h3>
                                            <p className="text-xs font-bold text-textSecondary mt-1.5 uppercase tracking-widest">Manage how and where alerts are delivered</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner self-start sm:self-auto">
                                        <button onClick={() => {
                                            setNotifs((n) => n.map((x) => ({ ...x, email: true, push: true })));
                                            toast.success("Enabled all alerts");
                                        }} className="px-4 sm:px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-white rounded-xl transition-all hover:shadow-sm">All On</button>
                                        <button onClick={() => {
                                            setNotifs((n) => n.map((x) => ({ ...x, email: false, push: false })));
                                            toast.info("Disabled all alerts");
                                        }} className="px-4 sm:px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-textSecondary hover:bg-white rounded-xl transition-all hover:shadow-sm">Mute All</button>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                                <th className="text-left py-5 px-10 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Notification Event</th>
                                                <th className="text-center py-5 px-6 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Email Delivery</th>
                                                <th className="text-center py-5 px-6 text-[10px] font-bold text-textSecondary uppercase tracking-widest">Push Alert</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {notifs.map((notif, i) => <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                                <td className="py-5 px-10">
                                                    <span className="text-[14px] font-bold text-textPrimary group-hover:text-primary transition-colors">{notif.label}</span>
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <button
                                                        onClick={() => toggleNotif(i, "email")}
                                                        className={`w-12 h-6.5 rounded-full transition-all duration-500 mx-auto flex items-center px-1 ${notif.email ? "bg-primary shadow-[0_0_8px_rgba(34,193,220,0.4)]" : "bg-gray-200"}`}
                                                    >
                                                        <div className={`w-4.5 h-4.5 rounded-full transition-all shadow-md ${notif.email ? "translate-x-4.5 bg-white" : "translate-x-0 bg-gray-400"}`} />
                                                    </button>
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <button
                                                        onClick={() => toggleNotif(i, "push")}
                                                        className={`w-12 h-6.5 rounded-full transition-all duration-500 mx-auto flex items-center px-1 ${notif.push ? "bg-primary shadow-[0_0_8px_rgba(34,193,220,0.4)]" : "bg-gray-200"}`}
                                                    >
                                                        <div className={`w-4.5 h-4.5 rounded-full transition-all shadow-md ${notif.push ? "translate-x-4.5 bg-white" : "translate-x-0 bg-gray-400"}`} />
                                                    </button>
                                                </td>
                                            </tr>)}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </section>
                        </div>}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    </div>;
}
export {
    Settings as default
};
