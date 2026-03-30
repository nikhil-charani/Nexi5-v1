import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]"
        >
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                
                {/* Spinner */}
                <div className="relative flex flex-col items-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-primary font-headings font-bold tracking-widest uppercase text-xs animate-pulse"
                    >
                        Nexi5 Loading...
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
