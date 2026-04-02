import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';

// Datasets
import { portalTasks, portalActions, mockupUser, upcomingLeave } from '../../datasets/landing/selfServiceData';


export default function SelfServicePortalSection() {
    return (
        <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="py-12 md:py-16 lg:py-24 bg-white dark:bg-transparent overflow-hidden transition-colors duration-300"
        >
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16">

                {/* Left Side: Mockup - Hidden on mobile */}
                <div className="hidden lg:block w-full lg:w-1/2 relative perspective-1000">

                    {/* Decorative Backdrops */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 dark:bg-[#3ec3ff]/10 rounded-full blur-[80px] -z-10 transition-colors" />

                    {/* Main Mockup Window */}
                    <motion.div
                        initial={{ opacity: 0, rotateY: 10, x: -30 }}
                        whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white dark:bg-[#0c162d]/90 dark:backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transform hover:scale-[1.02] transition-all duration-500 will-change-transform"
                    >
                        {/* Header */}
                        <div className="h-14 border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-6 bg-gray-50/50 dark:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 p-0.5 transition-colors">
                                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-dark dark:text-white transition-colors">Welcome, {mockupUser.name}</div>
                                    <div className="text-[10px] text-gray-400 dark:text-gray-400 transition-colors">{mockupUser.role}</div>

                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-colors">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Action Grid */}
                        <div className="p-6">
                            <div className="flex overflow-x-auto pb-4 lg:pb-0 lg:grid lg:grid-cols-2 gap-4 mb-6 snap-x snap-mandatory hide-scrollbar">
                                {portalActions.map((action, i) => (
                                    <div key={i} className={`min-w-[140px] flex-shrink-0 snap-center p-4 rounded-xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors`}>
                                        <div className={`w-10 h-10 rounded-full ${action.color} ${action.text} flex items-center justify-center transition-colors`}>
                                            <div className="w-5 h-5 rounded border border-current opacity-70 transition-colors" />
                                        </div>
                                        <span className="text-xs font-medium text-dark dark:text-gray-200 transition-colors">{action.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Upcoming Leave Widget */}
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-dark dark:text-white transition-colors">Upcoming Leave</span>
                                    <span className="text-xs text-primary dark:text-[#3ec3ff] font-medium transition-colors">View All</span>
                                </div>
                                <div className="flex items-center justify-between bg-white dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 flex flex-col items-center justify-center font-bold text-xs uppercase leading-none transition-colors">
                                            <span>{upcomingLeave.month}</span>
                                            <span className="text-base text-dark dark:text-white transition-colors">{upcomingLeave.day}</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-dark dark:text-white transition-colors">{upcomingLeave.type}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{upcomingLeave.duration}</div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="absolute -right-4 md:-right-12 top-1/2 p-4 bg-white dark:bg-[#0c162d]/90 dark:backdrop-blur-md rounded-xl shadow-xl border border-gray-100 dark:border-white/10 flex items-center gap-4 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-500/20 flex items-center justify-center transition-colors">
                            <CheckCircle2 size={24} className="text-green-500 dark:text-green-400 transition-colors" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-dark dark:text-white transition-colors">Payslip Generated</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">March 2026 Salary</div>
                        </div>
                    </motion.div>

                </div>

                {/* Right Side: Content */}
                <div className="w-full lg:w-1/2">
                    <div className="text-primary dark:text-[#3ec3ff] font-medium text-sm tracking-wider uppercase mb-3 transition-colors">Employee Experience</div>
                    <h2 className="font-headings text-3xl md:text-[40px] leading-[1.2] font-bold text-dark dark:text-white mb-6 transition-colors">
                        Empower your team with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-[#3ec3ff] dark:to-primary">Self-Service Portal</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed transition-colors">
                        Give your employees the autonomy to manage their own HR needs without bottlenecking your HR department. A beautiful, intuitive portal accessible from anywhere.
                    </p>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8"
                    >
                        {portalTasks.map((task, idx) => (

                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                className="flex items-center gap-3 group"
                            >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lightSky dark:bg-white/10 text-primary dark:text-[#3ec3ff] flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-[#3ec3ff] group-hover:text-white transition-colors">
                                    <CheckCircle2 size={14} />
                                </div>
                                <span className="text-dark dark:text-gray-200 font-medium transition-colors">{task}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                </div>

            </div>
        </motion.section>
    );
}
