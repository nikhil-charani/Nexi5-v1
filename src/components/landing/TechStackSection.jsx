import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../animations/variants';

// Datasets
import { techStackData } from '../../datasets/landing/techStackData';


export default function TechStackSection() {
    return (
        <motion.section
            id="technology"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="py-12 md:py-16 lg:py-24 bg-white dark:bg-none dark:bg-transparent transition-colors duration-300"
        >
            <div className="max-w-[1200px] mx-auto px-6 text-center">

                <div className="mb-16">
                    <h2 className="font-headings text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4 transition-colors">
                        Powered by modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-[#3ec3ff] dark:to-primary">Technology</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
                        Built on a robust, scalable, and secure technology foundation to ensure high performance and data security.
                    </p>
                </div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
                >
                    {techStackData.map((tech, idx) => (

                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border ${tech.color} min-w-[140px] shadow-sm hover:shadow-lg transition-all`}
                        >
                            <span className="font-bold text-lg mb-1">{tech.name}</span>
                            <span className="text-xs opacity-80">{tech.desc}</span>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </motion.section>
    );
}
