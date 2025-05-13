import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalHero: 0,
        totalAbout: 0,
        activeHero: 0,
        totalSkills: 0,
        totalCertificates: 0,
        totalProjects: 0,
        totalFeedback: 0,
        totalUsers: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const meResponse = await fetch('http://localhost:5000/me', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!meResponse.ok) {
                    navigate('/login');
                    return;
                }
                const meData = await meResponse.json();
                setCurrentUser(meData);

                const endpoints = [
                    { key: 'totalHero', url: '/hero', hasActive: true },
                    { key: 'totalAbout', url: '/about', hasActive: true },
                    { key: 'totalSkills', url: '/skills' },
                    { key: 'totalCertificates', url: '/certificate' },
                    { key: 'totalProjects', url: '/project' },
                    { key: 'totalFeedback', url: '/feedback' },
                    { key: 'totalUsers', url: '/users' },
                ];

                const newStats = { ...stats };
                let activeHero = 0;

                for (const { key, url, hasActive } of endpoints) {
                    try {
                        const response = await fetch(`http://localhost:5000${url}`, {
                            method: 'GET',
                            credentials: 'include',
                        });
                        if (!response.ok) {
                            newStats[key] = 0;
                            continue;
                        }
                        const data = await response.json();
                        newStats[key] = Array.isArray(data) ? data.length : 0;

                        if (hasActive && key === 'totalHero') {
                            activeHero = data.filter(item => item.isActive).length;
                            newStats.activeHero = activeHero;
                        }
                    } catch (error) {
                        newStats[key] = 0;
                    }
                }

                setStats(newStats);
            } catch (error) {
                alert('Failed to fetch data. Try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <motion.main
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-slate-100 dark:bg-slate-900 min-h-screen p-3 sm:p-4 md:p-6 pt-16 sm:pt-14"
        >
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <h1 className="text-xl ml-8 sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                    Admin Dashboard
                </h1>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    {currentUser && (
                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Welcome, {currentUser.userName}
                        </span>
                    )}
                    <ThemeSwitcher />
                </div>
            </header>

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-slate-600 dark:text-slate-400 p-4"
                >
                    Loading...
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-2">
                            Welcome to Your Admin Dashboard
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Manage your website content efficiently. Monitor metrics, update sections, and take quick actions.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                    >
                        {[
                            { title: 'Total Hero Content', value: stats.totalHero },
                            { title: 'Total About Entries', value: stats.totalAbout },
                            { title: 'Active Hero', value: stats.activeHero },
                            { title: 'Total Skills', value: stats.totalSkills },
                            { title: 'Total Certificates', value: stats.totalCertificates },
                            { title: 'Total Projects', value: stats.totalProjects },
                            { title: 'Total Feedback', value: stats.totalFeedback },
                            { title: 'Total Users', value: stats.totalUsers },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105"
                            >
                                <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {['Hero', 'About', 'Skills', 'Certificates', 'Projects', 'Feedback', 'Users'].map(
                                (item) => (
                                    <button
                                        key={item}
                                        onClick={() => navigate(`/admin/${item.toLowerCase()}`)}
                                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Manage {item}
                                    </button>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.main>
    );
}