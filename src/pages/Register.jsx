import { motion } from 'framer-motion';
import { useState } from 'react';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { Link } from 'react-router-dom'; // Asumsi menggunakan React Router
import Cursor from '../components/Cursor';

export default function Register() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName,
                    email,
                    password,
                    confPassword: password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.msg);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                setUserName('');
                setEmail('');
                setPassword('');
            } else {
                alert(data.msg); // kalau error, tetap tampilkan pesan error server
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan!');
        }
    };



    return (
        <div className="min-h-screen bg-[#F1EFEC] dark:bg-[#0f172a] flex flex-col">
            <Cursor />
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                className="fixed top-0 left-0 right-0 z-50 py-4 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-md"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <motion.a
                        href="/"
                        className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-wider flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="mr-2 text-2xl">✨</span>
                        <span>MansWeb</span>
                    </motion.a>
                    <ThemeSwitcher />
                </div>
            </motion.header>

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-16"
            >
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6">
                        Register
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Full Name
                            </label>
                            <input
                                id="userName"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="mt-1 w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <motion.button
                            onClick={handleRegister}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
                        >
                            Sign Up
                        </motion.button>
                    </div>
                    <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.main>
        </div>
    );
}
