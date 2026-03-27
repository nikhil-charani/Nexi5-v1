import { useAppContext } from '@/hooks/useAppContext';

export default function AuthCard({ children }) {
    const { isDark } = useAppContext();
    const isDarkMode = isDark;

    return (
        <div className={`w-full rounded-2xl border shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-center transition-colors duration-500 ${isDarkMode
                ? 'bg-[#0c162d]/60 border-white/10 text-white'
                : 'bg-white/95 border-gray-200 text-gray-900'
            }`} style={{ minHeight: '420px' }}>
            {children}
        </div>
    );
}
