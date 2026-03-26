import React from 'react';
import { motion } from 'framer-motion';
import { UsersRound, Clock, CalendarDays, Receipt, LineChart, FileText } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';

// Datasets
import { coreFeatures } from '../../datasets/landing/coreFeaturesData';


export default function CoreFeaturesSection() {
    return (
        <motion.section
            id="features"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="py-12 md:py-16 lg:py-24 bg-gray-50 dark:bg-none dark:bg-transparent border-y border-gray-100 dark:border-white/10 transition-colors duration-300"
        >
            <div className="max-w-[1200px] mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="font-headings text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4 transition-colors">
                            Everything you need to <br className="hidden md:block" /> manage your workforce
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors">
                            Powerful tools designed to simplify your daily HR tasks.
                        </p>
                    </div>
                    <button className="text-primary dark:text-[#3ec3ff] font-medium hover:text-secondary dark:hover:text-white flex items-center gap-1 transition-colors">
                        View all features <span className="text-xl">→</span>
                    </button>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar"
                >
                    {coreFeatures.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="min-w-[280px] md:min-w-0 flex-1 snap-center group relative bg-white dark:bg-white/5 dark:backdrop-blur-md p-8 rounded-2xl border border-gray-100 dark:border-white/10 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 dark:hover:border-[#3ec3ff]/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-lightSky dark:bg-white/10 text-primary dark:text-[#3ec3ff] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary dark:group-hover:bg-[#3ec3ff] group-hover:text-white transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="font-headings text-xl font-bold text-dark dark:text-white mb-3 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                <style dangerouslySetInnerHTML={{
                    __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}} />

            </div>
        </motion.section>
    );
}
