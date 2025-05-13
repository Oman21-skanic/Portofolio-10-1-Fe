import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('http://localhost:5000/me', {
                    credentials: 'include' // Important for cookies/sessions
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUserData(data);
                } else {
                    setIsLoggedIn(false);
                    setUserData(null);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLoggedIn(false);
                setUserData(null);
            }
        };

        checkLoginStatus();
    }, []);

    // Lock scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    // Add scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUserData(null);
                setIsMenuOpen(false);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Menu items data
    const menuItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'About', icon: '👨‍💻' },
        { name: 'Skills', icon: '💻' },
        { name: 'Projects', icon: '🛠️' },
        { name: 'Certificates', icon: '🏆' },
        { name: 'Feedback', icon: '💬' },
    ];

    return (
        <>
            {/* Main Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{
                    type: 'spring',
                    damping: 10,
                    stiffness: 100,
                }}
                className={`fixed top-0 left-0 right-0 z-[100] py-3 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-md'
                    : 'bg-white dark:bg-slate-900'
                    }`}
            >
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-between items-center">
                        {/* Logo */}
                        <motion.a
                            href="#"
                            className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-wider flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-cursor-hover
                        >
                            {/* <span className="mr-2 text-2xl">✨</span> */}
                            <span style={{ fontFamily: ' Permanent Marker, cursive' }}>MansWeb</span>
                        </motion.a>

                        {/* Right Side - Theme Toggle and Menu Button */}
                        <div className="flex items-center space-x-4">
                            <ThemeSwitcher />

                            {/* Burger Menu Button */}
                            <motion.button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex flex-col items-center justify-center w-10 h-10"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                data-cursor-hover
                                aria-label="Menu"
                            >
                                {[0, 1, 2].map((index) => (
                                    <motion.span
                                        key={index}
                                        className={`block w-6 h-0.5 my-1 rounded-full bg-blue-600 dark:bg-blue-400 transition-all`}
                                        animate={{
                                            opacity: isMenuOpen ? (index === 1 ? 0 : 1) : 1,
                                            rotate: isMenuOpen ? (index === 0 ? 45 : index === 2 ? -45 : 0) : 0,
                                            y: isMenuOpen ? (index === 0 ? 7 : index === 2 ? -7 : 0) : 0,
                                            width: isMenuOpen ? '1.5rem' : '1.5rem'
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    />
                                ))}
                            </motion.button>
                        </div>
                    </nav>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300,
                            }}
                            className="fixed inset-y-0 right-0 z-[95] w-full max-w-md bg-white dark:bg-slate-800 shadow-xl cursor-default"
                        >
                            <div className="h-full flex flex-col p-6">
                                {/* Menu Header */}
                                <div className="flex justify-between items-center mb-12">
                                    <motion.a
                                        href="#"
                                        className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-wider flex items-center"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <span className="mr-2 text-2xl">✨</span>
                                        <span>MansWeb</span>
                                    </motion.a>

                                    <motion.button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        aria-label="Close menu"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </motion.button>
                                </div>

                                {/* Menu Items */}
                                <nav className="flex-1 flex flex-col justify-center">
                                    {menuItems.map((item, i) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: {
                                                    delay: 0.1 + i * 0.1,
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 20
                                                },
                                            }}
                                        >
                                            <a
                                                href={`#${item.name.toLowerCase()}`}
                                                className="flex items-center py-4 px-6 text-2xl font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors rounded-lg group"
                                                onClick={() => setIsMenuOpen(false)}
                                                data-cursor-hover
                                            >
                                                <span className="mr-4 text-xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                    {item.icon}
                                                </span>
                                                <span>{item.name}</span>
                                                <span className="ml-auto text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    →
                                                </span>
                                            </a>
                                        </motion.div>
                                    ))}

                                    {/* Login/Logout Button */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                                delay: 0.1 + menuItems.length * 0.1,
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 20
                                            },
                                        }}
                                    >
                                        {isLoggedIn ? (
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center py-4 px-6 text-2xl font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors rounded-lg group w-full"
                                                data-cursor-hover
                                            >
                                                <span className="mr-4 text-xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </span>
                                                <span>Logout</span>
                                                <span className="ml-auto text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    →
                                                </span>
                                            </button>
                                        ) : (
                                            <a
                                                href="/login"
                                                className="flex items-center py-4 px-6 text-2xl font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors rounded-lg group"
                                                onClick={() => setIsMenuOpen(false)}
                                                data-cursor-hover
                                            >
                                                <span className="mr-4 text-xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                </span>
                                                <span>Login</span>
                                                <span className="ml-auto text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    →
                                                </span>
                                            </a>
                                        )}
                                    </motion.div>

                                    {/* Show user info if logged in */}
                                    {isLoggedIn && userData && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + menuItems.length * 0.1 }}
                                            className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                                                    {userData.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{userData.userName}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-300">{userData.email}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </nav>

                                {/* Footer */}
                                <motion.div
                                    className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + menuItems.length * 0.1 }}
                                >
                                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                                        <span>© {new Date().getFullYear()} MansWeb</span>
                                        <div className="flex space-x-4">
                                            {/* Social links would go here */}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}