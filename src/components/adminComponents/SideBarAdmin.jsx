import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SiHomepage } from "react-icons/si";
import { FcAbout } from "react-icons/fc";
import { FaTachometerAlt, FaUsers, FaSignOutAlt, FaCertificate, FaProjectDiagram, FaTools, FaBars, FaTimes } from 'react-icons/fa';

export default function SideBarAdmin({ handleLogout, isOpen, toggleSidebar }) {
    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed top-4 left-4 z-50 mt-3 text-slate-700 dark:text-slate-300 p-2 rounded-full bg-white dark:bg-slate-800 shadow-md"
                onClick={toggleSidebar}
            >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </motion.button>

            <motion.aside
                animate={{
                    x: isOpen ? 0 : -256,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed top-0 h-screen w-56 bg-white dark:bg-slate-800 shadow-lg z-40 ${isOpen ? 'block' : 'hidden'}`}
            >
                <div className="p-3 sm:p-4 h-full flex flex-col">
                    <motion.div
                        className="text-lg mt-12 sm:text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center mb-4 sm:mb-6"
                        whileHover={{ scale: 1.05 }}
                        style={{ fontFamily: ' Permanent Marker, cursive' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>MansWeb Admin</span>
                    </motion.div>

                    <nav className="flex-1 space-y-1 overflow-y-auto">
                        {[
                            { to: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
                            { to: '/admin/users', icon: FaUsers, label: 'Users' },
                            { to: '/admin/hero', icon: SiHomepage, label: 'Hero' },
                            { to: '/admin/about', icon: FcAbout, label: 'About' },
                            { to: '/admin/skills', icon: FaTools, label: 'Skills' },
                            { to: '/admin/projects', icon: FaProjectDiagram, label: 'Projects' },
                            { to: '/admin/certificates', icon: FaCertificate, label: 'Certificates' },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors text-sm sm:text-base"
                                onClick={toggleSidebar}
                            >
                                <item.icon className="text-blue-600 dark:text-blue-400 min-w-[18px] sm:min-w-[20px]" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={() => { handleLogout(); toggleSidebar(); }}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 mt-auto text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        <FaSignOutAlt className="text-blue-600 dark:text-blue-400 min-w-[18px] sm:min-w-[20px]" />
                        <span>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}