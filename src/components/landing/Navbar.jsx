import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import brandLogo from '../../assets/Nexi5Logo-1.png';

export default function Navbar({ onLoginClick, onRegisterClick, isDarkMode, activeSection }) {
    const [isOpen, setIsOpen] = useState(false);

    // Smooth scroll to section
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <nav className="fixed w-full z-50 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/10 transition-all duration-500 overflow-visible shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 h-20 md:h-24 flex items-center justify-between relative">
                {/* Logo */}
                <div
                    className="flex-shrink-0"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="flex flex-col items-start cursor-pointer relative z-10 group bg-transparent">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125 -z-10 opacity-60" />
                        <img
                            src={brandLogo}
                            alt="Nexi5 Logo"
                            className="h-[60px] md:h-[120px] w-auto object-contain transform transition-all duration-500 group-hover:scale-105 logo-glow"
                        />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    <button onClick={() => scrollTo('solutions')} className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-[#3ec3ff] font-medium text-sm transition-colors relative group ${activeSection === 'solutions' ? 'text-primary dark:text-[#3ec3ff]' : ''}`}>
                        Solutions
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary dark:bg-[#3ec3ff] transition-all group-hover:w-full ${activeSection === 'solutions' ? 'w-full' : 'w-0'}`} />
                    </button>
                    <button onClick={() => scrollTo('features')} className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-[#3ec3ff] font-medium text-sm transition-colors relative group ${activeSection === 'features' ? 'text-primary dark:text-[#3ec3ff]' : ''}`}>
                        Features
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary dark:bg-[#3ec3ff] transition-all group-hover:w-full ${activeSection === 'features' ? 'w-full' : 'w-0'}`} />
                    </button>
                    <button onClick={() => scrollTo('analytics')} className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-[#3ec3ff] font-medium text-sm transition-colors relative group ${activeSection === 'analytics' ? 'text-primary dark:text-[#3ec3ff]' : ''}`}>
                        Analytics
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary dark:bg-[#3ec3ff] transition-all group-hover:w-full ${activeSection === 'analytics' ? 'w-full' : 'w-0'}`} />
                    </button>
                    <button onClick={() => scrollTo('technology')} className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-[#3ec3ff] font-medium text-sm transition-colors relative group ${activeSection === 'technology' ? 'text-primary dark:text-[#3ec3ff]' : ''}`}>
                        Technology
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary dark:bg-[#3ec3ff] transition-all group-hover:w-full ${activeSection === 'technology' ? 'w-full' : 'w-0'}`} />
                    </button>
                    <button onClick={() => scrollTo('contact')} className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-[#3ec3ff] font-medium text-sm transition-colors relative group ${activeSection === 'contact' ? 'text-primary dark:text-[#3ec3ff]' : ''}`}>
                        Contact
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary dark:bg-[#3ec3ff] transition-all group-hover:w-full ${activeSection === 'contact' ? 'w-full' : 'w-0'}`} />
                    </button>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={onLoginClick}
                        className="border border-primary dark:border-[#3ec3ff] text-primary dark:text-[#3ec3ff] hover:bg-primary hover:text-white dark:hover:bg-[#3ec3ff] dark:hover:text-slate-900 px-6 py-2 rounded-full font-medium text-sm transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                        Login
                    </button>
                    <button
                        onClick={onRegisterClick}
                        className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full font-medium text-sm transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Direct buttons for Mobile */}
                <div className="flex lg:hidden items-center gap-2">
                    <button onClick={onLoginClick} className="text-primary dark:text-[#3ec3ff] font-bold text-xs py-1.5 px-3 border border-primary dark:border-[#3ec3ff] rounded-full">Login</button>
                    <button onClick={onRegisterClick} className="bg-primary text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-md">Sign Up</button>
                </div>
            </div>

        </nav>
    );
}
