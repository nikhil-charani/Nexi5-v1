import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { staggerContainer, fadeUp, parallaxBgMotion, isMobile } from '../../animations/variants';

export default function HeroSection({ onGetStarted }) {
    const [currentHeadlineIndex, setCurrentHeadlineIndex] = React.useState(0);
    const headlines = [
        "Smart HR Management Platform",
        "Manage Employees Efficiently",
        "Automate Payroll & Attendance",
        "Empower Your Workforce"
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const headlineText = headlines[currentHeadlineIndex];
    const letters = headlineText.split("");

    return (
        <section id="hero" className="relative py-24 md:pt-48 md:pb-32 lg:pb-40 overflow-hidden bg-gradient-to-r from-sky-100 via-blue-100 to-cyan-100 dark:bg-none transition-colors duration-300 min-h-[90vh] flex items-center">
            {/* Background Gradients */}
            <div className={`absolute top-0 left-0 w-full h-full overflow-hidden -z-10 ${isMobile ? 'opacity-50' : ''}`}>
                <motion.div
                    variants={!isMobile ? parallaxBgMotion : {}}
                    animate="animate"
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-lightSky/50 dark:bg-[#3ec3ff]/10 blur-[120px]"
                />
                <motion.div
                    variants={!isMobile ? parallaxBgMotion : {}}
                    animate="animate"
                    className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 dark:bg-secondary/10 blur-[120px]"
                />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 h-full flex flex-col lg:flex-row items-center gap-16">

                {/* Left Content */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="w-full lg:w-1/2 flex flex-col items-start"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lightSky dark:bg-white/5 text-primary dark:text-[#3ec3ff] font-medium text-sm mb-6 border border-primary/20 dark:border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        NEXI5 HRM Portal
                    </motion.div>

                    <div className="min-h-[160px] md:min-h-[220px]">
                        <motion.h1
                            key={currentHeadlineIndex}
                            className="font-headings text-4xl md:text-[56px] leading-[1.1] font-bold text-dark dark:text-white mb-6 transition-colors"
                        >
                            {letters.map((letter, index) => (
                                <motion.span
                                    key={`${currentHeadlineIndex}-${index}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: index * 0.03,
                                        ease: "easeOut"
                                    }}
                                    className={index > headlineText.indexOf("Platform") && headlineText.includes("Platform") ? "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary dark:from-[#3ec3ff] dark:via-primary dark:to-[#3ec3ff] animate-gradient-x bg-[length:200%_auto]" : ""}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.h1>
                    </div>

                    <motion.p variants={fadeUp} className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-lg transition-colors">
                        Manage employees, attendance, payroll, performance, and HR operations from one unified system.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={onGetStarted}
                            className="group flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-soft hover:shadow-lg"
                        >
                            Get Started
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={onGetStarted}
                            className="flex items-center justify-center gap-2 bg-white dark:bg-white/5 text-dark dark:text-white border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-sm"
                        >
                            Sign Up
                        </motion.button>
                    </motion.div>

                    <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700" />
                            ))}
                        </div>
                        <p>Trusted by <span className="font-semibold text-dark dark:text-white">1,000+</span> HR teams</p>
                    </motion.div>
                </motion.div>

                {/* Right Content - Dashboard Mockup - Hidden on mobile as per user request */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden lg:block w-full lg:w-1/2 relative perspective-1000"
                >
                    {/* Main Dashboard UI Mockup */}
                    <div className="relative rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-[#0c162d]/50 backdrop-blur shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 will-change-transform">
                        {/* Header bar */}
                        <div className="h-10 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="mx-auto w-48 h-5 bg-white dark:bg-white/10 rounded flex items-center justify-center shadow-sm">
                                <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full" />
                            </div>
                        </div>

                        {/* Mockup Body Container */}
                        <div className="p-4 sm:p-6 bg-white dark:bg-transparent flex flex-col gap-4">

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                        <div className="w-6 h-6 rounded bg-lightSky dark:bg-white/10 mb-2" />
                                        <div className="w-12 h-4 bg-gray-200 dark:bg-white/20 rounded mb-1" />
                                        <div className="w-8 h-6 bg-gray-800 dark:bg-white/80 rounded" />
                                    </div>
                                ))}
                            </div>

                            {/* Chart & Cards Row */}
                            <div className="flex gap-4">
                                <div className="w-2/3 h-40 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 p-4 flex flex-col justify-end gap-2">
                                    <div className="w-24 h-4 bg-gray-200 dark:bg-white/20 rounded self-start mb-auto" />
                                    <div className="flex items-end gap-2 h-20 w-full">
                                        {[30, 45, 25, 60, 40, 70, 50, 80].map((h, i) => (
                                            <div key={i} className={`flex-1 rounded-t-sm ${i % 2 === 0 ? 'bg-primary dark:bg-primary/80' : 'bg-secondary/40 dark:bg-secondary/40'}`} style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="w-1/3 flex flex-col gap-4">
                                    <div className="flex-1 bg-gradient-to-br from-primary to-secondary rounded-xl p-3 flex flex-col justify-between shadow-soft text-white relative overflow-hidden">
                                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
                                        <div className="w-8 h-4 bg-white/30 rounded" />
                                        <div>
                                            <div className="text-sm text-white/80">Pending Pay</div>
                                            <div className="font-bold text-lg">$24k</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 p-3">
                                        <div className="w-16 h-3 bg-gray-200 dark:bg-white/20 rounded mb-3" />
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-gray-300 dark:bg-white/30 border border-white dark:border-gray-800" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Employee List Row */}
                            <div className="flex flex-col gap-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/20" />
                                            <div>
                                                <div className="w-20 h-3 bg-gray-800 dark:bg-white/80 rounded mb-1" />
                                                <div className="w-12 h-2.5 bg-gray-400 dark:bg-white/40 rounded" />
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] rounded-full font-medium border dark:border-green-500/20">Active</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Floating UI Elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-8 top-20 bg-white dark:bg-[#0c162d]/90 dark:backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 hidden md:block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">✓</div>
                            <div>
                                <div className="text-sm font-bold text-dark dark:text-white">Payroll Processed</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Just now</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -left-6 bottom-16 bg-white dark:bg-[#0c162d]/90 dark:backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 hidden md:block max-w-[160px]"
                    >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Attendance Today</div>
                        <div className="text-xl font-bold font-headings text-dark dark:text-white mb-2">98.5%</div>
                        <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 outline-none">
                            <div className="bg-primary dark:bg-[#3ec3ff] h-1.5 rounded-full w-[98.5%]" />
                        </div>
                    </motion.div>
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scroll Down</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-5 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex justify-center p-1"
                >
                    <div className="w-1 h-2 bg-primary dark:bg-[#3ec3ff] rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}
