import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Cursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // 1. Track mouse movement
    useEffect(() => {
        const handleMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsHovering(!!e.target.closest('a, button, input, [data-cursor]'));
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // 2. Sync with ThemeSwitcher's localStorage
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(localStorage.getItem('darkMode') === 'true');
        };

        // Initial check
        checkTheme();

        // Listen for storage changes (when ThemeSwitcher updates)
        window.addEventListener('storage', checkTheme);

        // Custom event listener as fallback
        window.addEventListener('themeChange', checkTheme);

        return () => {
            window.removeEventListener('storage', checkTheme);
            window.removeEventListener('themeChange', checkTheme);
        };
    }, []);

    // 3. Cursor variants
    const cursorVariants = {
        default: {
            x: position.x - 8,
            y: position.y - 8,
            backgroundColor: isDark ? '#fff' : '#000',
            width: 16,
            height: 16,
            transition: { type: 'spring', damping: 30, stiffness: 500 }
        },
        hover: {
            x: position.x - 12,
            y: position.y - 12,
            backgroundColor: 'transparent',
            border: `2px solid ${isDark ? '#60a5fa' : '#3b82f6'}`,
            width: 24,
            height: 24
        }
    };

    return (
        <motion.div
            variants={cursorVariants}
            animate={isHovering ? 'hover' : 'default'}
            className="fixed rounded-full pointer-events-none z-[9999]"
        />
    );
}