import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeSwitcher() {
    const [darkMode, setDarkMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedMode === 'true' || (!savedMode && systemPrefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.documentElement.classList.toggle('dark', newMode);

        // Trigger custom event for cursor
        window.dispatchEvent(new Event('themeChange'));
    };

    return (
        <button
            onClick={toggleTheme}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-slate-700/80 shadow-sm hover:shadow-md transition-all duration-300 group backdrop-blur-sm border border-gray-200 dark:border-slate-600"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Animated background highlight */}
            <span className={`absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></span>

            {/* Icons with smooth transition */}
            <div className="relative flex items-center justify-center w-full h-full">
                <SunIcon className={`absolute w-5 h-5 text-amber-500 transition-all duration-300 ${darkMode ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}`} />
                <MoonIcon className={`absolute w-5 h-5 text-blue-500 transition-all duration-300 ${darkMode ? '-rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
            </div>

            {/* Tooltip */}
            <span className={`absolute top-full mt-2 px-2 py-1 text-xs font-medium rounded-md bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-800 shadow-lg transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                {darkMode ? 'Light mode' : 'Dark mode'}
            </span>
        </button>
    );
}