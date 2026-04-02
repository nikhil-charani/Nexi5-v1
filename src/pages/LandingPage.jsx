import React, { useEffect, useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import RoleAccessSection from '@/components/landing/RoleAccessSection';
import CoreFeaturesSection from '@/components/landing/CoreFeaturesSection';
import SelfServicePortalSection from '@/components/landing/SelfServicePortalSection';
import AnalyticsSection from '@/components/landing/AnalyticsSection';
import TechStackSection from '@/components/landing/TechStackSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollProgressButton from '@/components/landing/ScrollProgressButton';

// Memoize sections to prevent re-renders when activeSection changes
const MemoHero = memo(HeroSection);
const MemoAbout = memo(AboutSection);
const MemoRoleAccess = memo(RoleAccessSection);
const MemoFeatures = memo(CoreFeaturesSection);
const MemoSelfService = memo(SelfServicePortalSection);
const MemoAnalytics = memo(AnalyticsSection);
const MemoTech = memo(TechStackSection);
const MemoCTA = memo(CTASection);
const MemoFooter = memo(Footer);

export default function LandingPage() {
    const navigate = useNavigate();
    const { isDark, toggleDark, isLoggedIn } = useAppContext();
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (isLoggedIn) {
            navigate('/dashboard');
        }

        const sections = ['solutions', 'features', 'analytics', 'technology', 'contact'];
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [isLoggedIn, navigate]);

    const handleLogin = useCallback(() => navigate('/login'), [navigate]);
    const handleRegister = useCallback(() => navigate('/register'), [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`min-h-screen font-sans selection:bg-primary/30 transition-colors duration-300 relative ${isDark ? 'dark auth-background text-white' : 'text-dark bg-white'}`}
        >
            <Navbar
                onLoginClick={handleLogin}
                onRegisterClick={handleRegister}
                isDarkMode={isDark}
                activeSection={activeSection}
            />

            <div className="relative z-10">
                {!isDark && (
                    <div className="fixed inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
                    </div>
                )}

                <main className={!isDark ? 'bg-gradient-to-b from-white via-blue-50 to-white' : 'dark:bg-transparent'}>
                    <MemoHero onGetStarted={handleRegister} />
                    <MemoAbout />
                    <MemoRoleAccess />
                    <MemoFeatures />
                    <MemoSelfService />
                    <MemoAnalytics />
                    <MemoTech />
                    <MemoCTA onGetStarted={handleRegister} />
                </main>

                <MemoFooter />
                <ScrollProgressButton />
            </div>
        </motion.div>
    );
}
