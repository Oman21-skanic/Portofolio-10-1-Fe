import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function SkillPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState({
        name: '',
        category: '',
        level: '',
        iconSlug: ''
    });
    const [editSkill, setEditSkill] = useState(null);
    const navigate = useNavigate();

    // Fetch current user and skills list
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

                const skillsResponse = await fetch('http://localhost:5000/skills', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const skillsData = await skillsResponse.json();
                if (skillsResponse.ok) {
                    setSkills(Array.isArray(skillsData) ? skillsData : []);
                } else {
                    alert(skillsData.error || 'Gagal mengambil data skill');
                    setSkills([]);
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

    // Handle create skill
    const handleCreateSkill = async () => {
        if (!newSkill.name || !newSkill.category || !newSkill.level || newSkill.level < 1 || newSkill.level > 100) {
            alert('Field name, category, dan level wajib diisi. Level harus antara 1-100.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/skills', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSkill)
            });

            const data = await response.json();

            if (response.ok) {
                setSkills([...skills, data]);
                setNewSkill({ name: '', category: '', level: '', iconSlug: '' });
                alert('Skill berhasil dibuat');
            } else {
                alert(data.error || 'Gagal membuat skill');
            }
        } catch (error) {
            console.error('Error creating skill:', error);
            alert('Terjadi kesalahan saat membuat skill.');
        }
    };

    // Handle update skill
    const handleUpdateSkill = async () => {
        if (!editSkill.name || !editSkill.category || !editSkill.level || editSkill.level < 1 || editSkill.level > 100) {
            alert('Field name, category, dan level wajib diisi. Level harus antara 1-100.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/skills/${editSkill.uuid}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editSkill)
            });

            const data = await response.json();

            if (response.ok) {
                setSkills(skills.map(skill => skill.uuid === editSkill.uuid ? { ...skill, ...editSkill } : skill));
                setEditSkill(null);
                alert('Skill berhasil diperbarui');
            } else {
                alert(data.error || 'Gagal memperbarui skill');
            }
        } catch (error) {
            console.error('Error updating skill:', error);
            alert('Terjadi kesalahan saat memperbarui skill.');
        }
    };

    // Handle delete skill
    const handleDeleteSkill = async (uuid) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus skill ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/skills/${uuid}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setSkills(skills.filter(skill => skill.uuid !== uuid));
                alert('Skill berhasil dihapus');
            } else {
                alert(data.error || 'Gagal menghapus skill');
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Terjadi kesalahan saat menghapus skill.');
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
                    Skill Management
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
                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2  gap-3"
                    >
                        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">
                                Total Skills
                            </h3>
                            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {skills.length}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">
                                Last Update
                            </h3>
                            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </motion.div>

                    {/* Create Skill Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Create New Skill
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="newName" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Name
                                </label>
                                <input
                                    id="newName"
                                    type="text"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Skill Name (e.g., React)"
                                />
                            </div>
                            <div>
                                <label htmlFor="newCategory" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Category
                                </label>
                                <input
                                    id="newCategory"
                                    type="text"
                                    value={newSkill.category}
                                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="e.g., Frontend"
                                />
                            </div>
                            <div>
                                <label htmlFor="newLevel" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Level (1-100)
                                </label>
                                <input
                                    id="newLevel"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={newSkill.level}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (value >= 1 && value <= 100) {
                                            setNewSkill({ ...newSkill, level: value });
                                        } else {
                                            setNewSkill({ ...newSkill, level: '' });
                                        }
                                    }}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Masukkan level (1-100)"
                                />
                            </div>
                            <div>
                                <label htmlFor="newIconSlug" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Icon Slug (Optional)
                                </label>
                                <input
                                    id="newIconSlug"
                                    type="text"
                                    value={newSkill.iconSlug}
                                    onChange={(e) => setNewSkill({ ...newSkill, iconSlug: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="e.g., react"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <motion.button
                                    onClick={handleCreateSkill}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                >
                                    Create Skill
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit Skill Form */}
                    {editSkill && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                Edit Skill
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="editName" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Name
                                    </label>
                                    <input
                                        id="editName"
                                        type="text"
                                        value={editSkill.name}
                                        onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Skill Name (e.g., React)"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editCategory" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Category
                                    </label>
                                    <input
                                        id="editCategory"
                                        type="text"
                                        value={editSkill.category}
                                        onChange={(e) => setEditSkill({ ...editSkill, category: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="e.g., Frontend"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editLevel" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Level (1-100)
                                    </label>
                                    <input
                                        id="editLevel"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={editSkill.level}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= 100) {
                                                setEditSkill({ ...editSkill, level: value });
                                            } else {
                                                setEditSkill({ ...editSkill, level: '' });
                                            }
                                        }}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Masukkan level (1-100)"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editIconSlug" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Icon Slug (Optional)
                                    </label>
                                    <input
                                        id="editIconSlug"
                                        type="text"
                                        value={editSkill.iconSlug || ''}
                                        onChange={(e) => setEditSkill({ ...editSkill, iconSlug: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="e.g., react"
                                    />
                                </div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <motion.button
                                        onClick={handleUpdateSkill}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Update Skill
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setEditSkill(null)}
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

                    {/* Skills Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Skills List
                        </h2>
                        {loading ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading skills...</p>
                        ) : !Array.isArray(skills) || skills.length === 0 ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No skills found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-slate-700 dark:text-slate-300">
                                            <th className="p-2 sm:p-3">Name</th>
                                            <th className="p-2 sm:p-3">Category</th>
                                            <th className="p-2 sm:p-3">Level</th>
                                            <th className="p-2 sm:p-3">Icon</th>
                                            <th className="p-2 sm:p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skills.map((skill, index) => (
                                            <motion.tr
                                                key={skill.uuid}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            >
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{skill.name}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{skill.category}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{skill.level}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {skill.iconSlug ? (
                                                        <img
                                                            src={`https://cdn.simpleicons.org/${skill.iconSlug}`}
                                                            alt={skill.name}
                                                            className="w-5 h-5 sm:w-6 sm:h-6"
                                                        />
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 flex gap-2">
                                                    <motion.button
                                                        onClick={() => setEditSkill({ ...skill })}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDeleteSkill(skill.uuid)}
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