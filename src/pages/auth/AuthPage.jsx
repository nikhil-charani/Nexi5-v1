import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '@/layouts/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AnimatedFormContainer from '@/components/auth/AnimatedFormContainer';
import { useAppContext } from '@/hooks/useAppContext';
import './auth.css';

export default function AuthPage({ initialRegister = false }) {
    const navigate = useNavigate();
    const { login, register, isLoggedIn, changePassword } = useAppContext();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [isLoggedIn, navigate]);

    const roleOptions = [
        { value: 'Admin', label: 'Admin' },
        { value: 'HR Head', label: 'HR Head' },
        { value: 'HR Accountant', label: 'HR Accountant' },
        { value: 'HR Recruiter', label: 'HR Recruiter' },
        // { value: 'BDE',           label: 'BDE' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Employee', label: 'Employee' },
    ];

    const handleLogin = async (data) => {
        const role = data?.role;

        if (role === 'Employee') {
            const { username, password, isFirstLogin, newPassword } = data;
            const result = await login("", password, role, username);

            if (!result.success) {
                alert(result.error || 'Invalid credentials');
                return;
            }

            if (result.requiresPasswordChange === true) {
                if (isFirstLogin && newPassword) {
                    const changeRes = await changePassword(result.uid, newPassword);
                    if (changeRes?.success) {
                        // Login again to set auth cookies with the updated password.
                        const second = await login("", newPassword, role, username);
                        if (second?.success) navigate('/dashboard');
                        else alert(second?.error || 'Please login again with your new password');
                    } else {
                        alert(changeRes?.error || 'Failed to change password');
                    }
                    return;
                }

                alert('Account security: This is your first login. Please check the "First login? Change password" box above and set your permanent password before signing in.');
                return;
            }

            navigate('/dashboard');
            return;
        }

        const { email, password } = data;
        const result = await login(email, password, role);
        if (result.success) navigate('/dashboard');
        else alert(result.error || 'Invalid credentials');
    };

    const handleRegister = async (data) => {
        const { name, email, role, password } = data;
        if (email.includes('@')) {
            const result = await register(email, password, name, role);
            if (result.success) {
                alert('Registration successful! Please login.');
            } else {
                alert(result.error || 'Registration failed');
            }
        } else {
            alert('Please enter a valid email address');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
        >
            <AuthLayout>
                <AuthCard>
                    <AnimatedFormContainer
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                        roleOptions={roleOptions}
                        initialView={initialRegister ? 'register' : 'login'}
                    />
                </AuthCard>
            </AuthLayout>
        </motion.div>
    );
}
