import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/variants';

export default function CTASection({ onGetStarted }) {
    return (
        <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-transparent via-blue-50 to-transparent dark:bg-none relative overflow-hidden transition-colors duration-300"
        >
            <div className="max-w-[1000px] mx-auto px-6 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-primary to-secondary dark:from-primary/80 dark:to-secondary/80 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden transition-colors"
                >
                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                    <h2 className="font-headings text-3xl md:text-5xl font-bold mb-6 relative z-10">
                        Transform Your HR Operations
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto relative z-10">
                        Automate workflows, manage your workforce, and make data-driven decisions with powerful analytics. Join 1,000+ modern companies today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                            className="w-full sm:w-auto bg-white text-primary dark:bg-white/10 dark:text-white dark:border-white/20 border border-transparent dark:hover:bg-white/20 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
                        >
                            Start Free Trial
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                            className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                        >
                            Sign Up
                        </motion.button>
                    </div>
                </motion.div>

            </div>
        </motion.section>
    );
}
