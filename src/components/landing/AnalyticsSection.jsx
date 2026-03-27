import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { fadeUp, staggerContainer } from '../../animations/variants';

// Datasets
import {
    attendanceTrendsData, productivityData, attritionAnalysisData,
    payrollDistributionData, ANALYTICS_COLORS
} from '../../datasets/landing/analyticsData';


export default function AnalyticsSection() {
    return (
        <motion.section
            id="analytics"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="py-12 md:py-16 lg:py-24 bg-lightSky/30 dark:bg-transparent transition-colors duration-300"
        >
            <div className="max-w-[1200px] mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="font-headings text-3xl md:text-[40px] font-bold text-dark dark:text-white mb-4 transition-colors">
                        Real Time HR Analytics
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
                        Make data-driven decisions with interactive dashboards that provide insights into your workforce.
                    </p>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >

                    {/* Card 1: Attendance Trends */}
                    <motion.div
                        variants={fadeUp}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-2xl shadow-soft border border-white dark:border-white/10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
                    >
                        <div className="mb-6">
                            <h3 className="font-bold text-dark dark:text-white text-lg transition-colors">Attendance Trends</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Weekly check-in rates across all departments.</p>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceTrendsData}>

                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: '#0F172A' }}
                                        itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="val" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Card 2: Employee Productivity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-2xl shadow-soft border border-white dark:border-white/10 transition-colors"
                    >
                        <div className="mb-6">
                            <h3 className="font-bold text-dark dark:text-white text-lg transition-colors">Employee Productivity</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Average goal completion rate over 6 months.</p>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={productivityData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: '#0F172A' }}
                                    />
                                    <Line type="smooth" dataKey="val" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Card 3: Attrition Analysis */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-2xl shadow-soft border border-white dark:border-white/10 transition-colors"
                    >
                        <div className="mb-6">
                            <h3 className="font-bold text-dark dark:text-white text-lg transition-colors">Attrition Analysis</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Quarterly departure rates.</p>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attritionAnalysisData} barSize={40}>

                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6', opacity: 0.1 }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: '#0F172A' }}
                                    />
                                    <Bar dataKey="val" fill="#60A5FA" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Card 4: Payroll Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 rounded-2xl shadow-soft border border-white dark:border-white/10 flex flex-col transition-colors"
                    >
                        <div className="mb-2">
                            <h3 className="font-bold text-dark dark:text-white text-lg transition-colors">Payroll Cost Distribution</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Budget allocation by department.</p>
                        </div>
                        <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: '#0F172A' }}
                                    />
                                    <Pie
                                        data={payrollDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {payrollDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={ANALYTICS_COLORS[index % ANALYTICS_COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Custom Legend */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                                {payrollDistributionData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <div className="w-3 h-3 rounded-sm opacity-90 hover:opacity-100 transition-opacity" style={{ backgroundColor: ANALYTICS_COLORS[index % ANALYTICS_COLORS.length] }} />
                                        <span className="text-gray-600 dark:text-gray-300 transition-colors">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>


                </motion.div>

            </div>
        </motion.section>
    );
}
