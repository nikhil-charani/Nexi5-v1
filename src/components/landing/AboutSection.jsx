import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, Target, FileText, BookOpen } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import nexi5Logo from '../../assets/nexi5-logo.png';

// Datasets
import { aboutFeatures, aboutFloatingNodes } from '../../datasets/landing/aboutData';


export default function AboutSection() {
    return (
        <motion.section
            id="solutions"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative py-12 md:py-16 lg:py-24 bg-gray-50 dark:bg-transparent transition-colors duration-300 z-0"
        >
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-primary to-secondary blur-[120px] opacity-20 dark:opacity-10 -z-10 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Side - Abstract Illustration */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-square max-w-[500px] mx-auto relative flex items-center justify-center">
                            {/* Decorative rings */}
                            <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors" />
                            <div className="absolute inset-8 rounded-full border border-gray-200 dark:border-white/10 border-dashed transition-colors" />
                            <div className="absolute inset-16 rounded-full border border-primary/20 dark:border-[#3ec3ff]/20 bg-lightSky/30 dark:bg-white/5 transition-colors" />

                            {/* Central Element */}
                            <div className="w-[90px] h-[90px] rounded-full shadow-2xl flex items-center justify-center z-10 bg-[#0c162d] relative group">
                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow"></div>
                                <Users size={32} className="text-[#3ec3ff] z-20" />
                                <div className="absolute -bottom-2 bg-primary dark:bg-[#3ec3ff] text-white dark:text-[#0c162d] text-[10px] font-bold px-2 py-0.5 rounded-full z-30 shadow-lg">
                                    NEXI5
                                </div>
                            </div>

                            {/* Floating nodes */}
                            {aboutFloatingNodes.map((node, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -15, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, delay: node.delay, ease: "easeInOut" }}
                                    className={`absolute w-14 h-14 ${node.color} rounded-full flex items-center justify-center text-white shadow-xl z-20 border-2 border-white dark:border-white/20 hover:scale-110 transition-transform cursor-pointer`}
                                    style={{ top: node.top, left: node.left, transform: 'translate(-50%, -50%)' }}
                                >
                                    {node.icon}
                                </motion.div>
                            ))}

                            {/* Connectors */}
                            <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-white/10 transition-colors" style={{ zIndex: 0 }}>
                                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="text-primary dark:text-[#3ec3ff] font-medium text-sm tracking-wider uppercase mb-3 transition-colors">About The Platform</div>
                        <h2 className="font-headings text-3xl md:text-4xl font-bold text-dark dark:text-white mb-6 transition-colors">
                            Complete HR Management System
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-10 leading-relaxed transition-colors">
                            Transform your human resources department from a tactical necessity to a strategic advantage. Our platform centralizes all HR operations, eliminating paperwork and improving cross-team efficiency.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {aboutFeatures.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 hover:border-primary/30 dark:hover:border-[#3ec3ff]/30 transition-all cursor-default group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-lightSky dark:bg-white/10 text-primary dark:text-[#3ec3ff] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <span className="font-medium text-dark dark:text-white text-sm sm:text-base transition-colors">{feature.title}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </motion.section>
    );
}
