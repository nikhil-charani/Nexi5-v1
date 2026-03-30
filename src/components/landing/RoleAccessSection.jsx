import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Building, Users, UserCircle } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';

// Datasets
import { rolesAccessData } from '../../datasets/landing/rolesData';


export default function RoleAccessSection() {
    return (
        <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="py-12 md:py-16 lg:py-24 bg-white dark:bg-transparent overflow-hidden transition-colors duration-300"
        >
            <div className="max-w-[1200px] mx-auto px-6">

                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-medium text-sm mb-4 transition-colors">
                        Role-Based Capabilities
                    </div>
                    <h2 className="font-headings text-3xl md:text-[40px] font-bold text-dark dark:text-white mb-4 transition-colors">
                        Built for everyone in your company
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
                        Customized experiences, dashboards, and permissions for different roles to ensure smooth HR operations.
                    </p>
                </div>

                {/* Horizontal scroll on mobile, grid on desktop */}
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar"
                >
                    {rolesAccessData.map((role, idx) => (

                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="min-w-[280px] md:min-w-0 flex-1 snap-center bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group"
                        >
                            {/* Top Gradient Line */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className={`w-14 h-14 rounded-xl ${role.bg} ${role.iconColor} flex items-center justify-center mb-6 transition-colors`}>
                                {role.icon}
                            </div>

                            <h3 className="font-headings text-xl font-bold text-dark dark:text-white mb-4 transition-colors">{role.title}</h3>

                            <ul className="space-y-3">
                                {role.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 transition-colors" />
                                        <span className="text-gray-600 dark:text-gray-300 text-sm leading-snug transition-colors">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

            </div>

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
        </motion.section>
    );
}
