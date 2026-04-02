import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgressButton() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Calculate percentage
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(Math.min(100, Math.max(0, scrollPercent))); // Clamp between 0-100

            // Toggle visibility
            setIsVisible(scrollTop > 250);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial setup
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // SVG Circle Math
    const radius = 22; // For a 48x48 or 60x60 container, a 22px radius fits nicely
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    onClick={scrollToTop}
                    className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[1000] group flex items-center justify-center rounded-full bg-primary dark:bg-white/10 backdrop-blur-lg border border-primary/20 dark:border-white/20 shadow-xl hover:shadow-[0_0_25px_rgba(62,195,255,0.7)] hover:scale-110 transition-all duration-300 w-12 h-12 md:w-[60px] md:h-[60px]"
                    aria-label="Scroll to top"
                >
                    {/* SVG Progress Ring */}
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90 transform"
                        viewBox="0 0 52 52"
                    >
                        {/* Background Ring */}
                        <circle
                            className="text-gray-200 dark:text-white/10 transition-colors"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="26"
                            cy="26"
                        />
                        {/* Animated Progress Ring */}
                        <circle
                            className="text-white dark:text-[#3ec3ff] transition-all duration-150 ease-out"
                            strokeWidth="3"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="26"
                            cy="26"
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: strokeDashoffset
                            }}
                        />
                    </svg>

                    {/* Arrow Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ArrowUp className="text-white text-lg group-hover:-translate-y-1 transition-transform duration-300" size={24} />
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
