import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCog, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';

export default function LoginForm({ onLogin, onSwitchToRegister, roleOptions }) {
    const { isDark } = useAppContext();
    const isDarkMode = isDark;
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!role) {
            alert('Please select a role');
            return;
        }
        setIsLoading(true);
        // Simulate loading
        setTimeout(() => {
            onLogin({ email, password, role });
            setIsLoading(false);
        }, 800);
    };

    const inputClass = `w-full border rounded-lg py-3 pl-10 pr-4 text-xs transition-colors focus:outline-none ${isDarkMode
            ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#3ec3ff]/50'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary/50'
        }`;

    const selectClass = `w-full border rounded-lg py-3 pl-10 pr-3 text-xs transition-colors appearance-none cursor-pointer font-medium focus:outline-none ${isDarkMode
            ? 'bg-[#0c162d] border-white/10 text-white focus:border-[#3ec3ff]/50'
            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-primary/50'
        }`;

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3ec3ff] to-primary">
                    Welcome Back
                </h1>
                <p className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Sign in to your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} size={16} />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={inputClass}
                        required
                        autoFocus
                    />
                </div>

                <div className="relative group">
                    <UserCog className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${role ? 'text-primary dark:text-[#3ec3ff]' : (isDarkMode ? 'text-white/50' : 'text-gray-400 group-hover:text-gray-500')
                        }`} size={16} />
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className={`${selectClass} ${role ? 'border-primary/50 dark:border-[#3ec3ff]/50' : ''}`}
                        required
                    >
                        <option value="" disabled className={isDarkMode ? 'bg-[#0c162d]' : 'bg-white'}>Select Your Role</option>
                        {roleOptions.map(o => (
                            <option key={o.value} value={o.value} className={isDarkMode ? 'bg-[#0c162d]' : 'bg-white'}>{o.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${role ? 'rotate-180 text-primary dark:text-[#3ec3ff]' : (isDarkMode ? 'text-white/30' : 'text-gray-400')}`} />
                </div>

                <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} size={16} />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={inputClass}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <div className="flex justify-end">
                    <Link to="#" className="text-primary dark:text-[#3ec3ff] text-[11px] font-bold hover:underline">Forgot password?</Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all w-full leading-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing In...</span>
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="text-center text-xs">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-primary dark:text-[#3ec3ff] font-bold hover:underline"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}
