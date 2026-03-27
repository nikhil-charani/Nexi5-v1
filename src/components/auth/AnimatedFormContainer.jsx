import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AnimatedFormContainer({ onLogin, onRegister, roleOptions, initialView = 'login' }) {
    const [activeView, setActiveView] = useState(initialView);

    useEffect(() => {
        setActiveView(initialView);
    }, [initialView]);

    const variants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.98,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.98,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {activeView === 'login' ? (
                <motion.div
                    key="login"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full p-4 md:p-6"
                >
                    <LoginForm
                        onLogin={onLogin}
                        onSwitchToRegister={() => setActiveView('register')}
                        roleOptions={roleOptions}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="register"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full p-4 md:p-6"
                >
                    <RegisterForm
                        onRegister={onRegister}
                        onSwitchToLogin={() => setActiveView('login')}
                        roleOptions={roleOptions}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
