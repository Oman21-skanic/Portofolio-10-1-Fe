import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function HeroPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [hero, setHero] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newHero, setNewHero] = useState({
        title: '',
        subtitle: '',
        description: '',
        isActive: false
    });
    const [editHero, setEditHero] = useState(null);
    const navigate = useNavigate();

    // Fetch current user and hero list
    useEffect(() => {
        const fetchData = async () => {
            try {
                const meResponse = await fetch('http://localhost:5000/me', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!meResponse.ok) {
                    navigate('/login');
                    return;
                }
                const meData = await meResponse.json();
                setCurrentUser(meData);

                const heroResponse = await fetch('http://localhost:5000/hero', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const heroData = await heroResponse.json();
                if (heroResponse.ok) {
                    setHero(heroData);
                } else {
                    alert(heroData.error || 'Gagal mengambil data hero');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // Handle create hero
    const handleCreateHero = async () => {
        if (!newHero.title || !newHero.subtitle || !newHero.description) {
            alert('Field title, subtitle, dan description wajib diisi');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/hero', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHero)
            });

            const data = await response.json();

            if (response.ok) {
                setHero([...hero, data]);
                setNewHero({
                    title: '',
                    subtitle: '',
                    description: '',
                    isActive: false
                });
                alert('Hero berhasil dibuat');
            } else {
                alert(data.error || 'Gagal membuat hero');
            }
        } catch (error) {
            console.error('Error creating hero:', error);
            alert('Terjadi kesalahan saat membuat hero.');
        }
    };

    // Handle update hero
    const handleUpdateHero = async () => {
        if (!editHero.title || !editHero.subtitle || !editHero.description) {
            alert('Field title, subtitle, dan description wajib diisi');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/hero/${editHero.uuid}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editHero)
            });

            const data = await response.json();

            if (response.ok) {
                setHero(hero.map(h => h.uuid === editHero.uuid ? { ...h, ...editHero } : h));
                setEditHero(null);
                alert('Hero berhasil diperbarui');
            } else {
                alert(data.error || 'Gagal memperbarui hero');
            }
        } catch (error) {
            console.error('Error updating hero:', error);
            alert('Terjadi kesalahan saat memperbarui hero.');
        }
    };

    // Handle set active hero
    const handleSetActiveHero = async (uuid) => {
        try {
            const response = await fetch(`http://localhost:5000/hero/${uuid}/active`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                setHero(hero.map(h => ({
                    ...h,
                    isActive: h.uuid === uuid ? true : false
                })));
                alert('Hero set as active');
            } else {
                alert(data.error || 'Gagal mengatur hero sebagai aktif');
            }
        } catch (error) {
            console.error('Error setting active hero:', error);
            alert('Terjadi kesalahan saat mengatur hero sebagai aktif.');
        }
    };

    // Handle delete hero
    const handleDeleteHero = async (uuid) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus hero ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/hero/${uuid}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setHero(hero.filter(h => h.uuid !== uuid));
                alert('Hero berhasil dihapus');
            } else {
                alert(data.error || 'Gagal menghapus hero');
            }
        } catch (error) {
            console.error('Error deleting hero:', error);
            alert('Terjadi kesalahan saat menghapus hero.');
        }
    };

    return (
        <motion.main
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-slate-100 dark:bg-slate-900 min-h-screen p-3 sm:p-4 md:p-6 pt-16 sm:pt-14"
        >
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <h1 className="text-xl ml-8 sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                    Hero Management
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
                    {/* Create Hero Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Create New Hero
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="newTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Title
                                </label>
                                <input
                                    id="newTitle"
                                    type="text"
                                    value={newHero.title}
                                    onChange={(e) => setNewHero({ ...newHero, title: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Hero Title"
                                />
                            </div>
                            <div>
                                <label htmlFor="newSubtitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Subtitle
                                </label>
                                <input
                                    id="newSubtitle"
                                    type="text"
                                    value={newHero.subtitle}
                                    onChange={(e) => setNewHero({ ...newHero, subtitle: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Hero Subtitle"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="newDescription" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Description
                                </label>
                                <textarea
                                    id="newDescription"
                                    value={newHero.description}
                                    onChange={(e) => setNewHero({ ...newHero, description: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Hero Description"
                                    rows="4"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="newIsActive" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Set as Active
                                </label>
                                <div className="flex items-center mt-1">
                                    <input
                                        id="newIsActive"
                                        type="checkbox"
                                        checked={newHero.isActive}
                                        onChange={(e) => setNewHero({ ...newHero, isActive: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    />
                                    <span className="ml-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                        Display on website
                                    </span>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <motion.button
                                    onClick={handleCreateHero}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                >
                                    Create Hero
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit Hero Form */}
                    {editHero && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                Edit Hero
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="editTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Title
                                    </label>
                                    <input
                                        id="editTitle"
                                        type="text"
                                        value={editHero.title}
                                        onChange={(e) => setEditHero({ ...editHero, title: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Hero Title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editSubtitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Subtitle
                                    </label>
                                    <input
                                        id="editSubtitle"
                                        type="text"
                                        value={editHero.subtitle}
                                        onChange={(e) => setEditHero({ ...editHero, subtitle: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Hero Subtitle"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="editDescription" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Description
                                    </label>
                                    <textarea
                                        id="editDescription"
                                        value={editHero.description}
                                        onChange={(e) => setEditHero({ ...editHero, description: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Hero Description"
                                        rows="4"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="editIsActive" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Set as Active
                                    </label>
                                    <div className="flex items-center mt-1">
                                        <input
                                            id="editIsActive"
                                            type="checkbox"
                                            checked={editHero.isActive}
                                            onChange={(e) => setEditHero({ ...editHero, isActive: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                        />
                                        <span className="ml-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                            Display on website
                                        </span>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <motion.button
                                        onClick={handleUpdateHero}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Update Hero
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setEditHero(null)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Hero Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Hero List
                        </h2>
                        {loading ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading hero...</p>
                        ) : hero.length === 0 ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No hero found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-slate-700 dark:text-slate-300">
                                            <th className="p-2 sm:p-3">Title</th>
                                            <th className="p-2 sm:p-3">Subtitle</th>
                                            <th className="p-2 sm:p-3">Description</th>
                                            <th className="p-2 sm:p-3">Status</th>
                                            <th className="p-2 sm:p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hero.map((h, index) => (
                                            <motion.tr
                                                key={h.uuid}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            >
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{h.title}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{h.subtitle}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{h.description.substring(0, 50)}...</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {h.isActive ? (
                                                        <span className="text-green-600 dark:text-green-400 flex items-center">
                                                            <FaCheckCircle className="mr-1" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="text-yellow-600 dark:text-yellow-400">Draft</span>
                                                    )}
                                                </td>
                                                <td className="p-2 sm:p-3 flex gap-2">
                                                    {!h.isActive && (
                                                        <motion.button
                                                            onClick={() => handleSetActiveHero(h.uuid)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500"
                                                            title="Set Active"
                                                        >
                                                            <FaCheckCircle />
                                                        </motion.button>
                                                    )}
                                                    <motion.button
                                                        onClick={() => setEditHero({ ...h })}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDeleteHero(h.uuid)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </motion.main>
    );
}