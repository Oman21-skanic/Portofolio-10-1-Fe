import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [about, setAbout] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAbout, setNewAbout] = useState({
        title: '',
        subtitle: '',
        description: '',
        resumeLink: '',
        techStack: [],
        image: null,
        isActive: false
    });
    const [editAbout, setEditAbout] = useState(null);
    const [techInput, setTechInput] = useState('');
    const navigate = useNavigate();

    // Normalize techStack to ensure it's always an array
    const normalizeTechStack = (techStack) => {
        if (Array.isArray(techStack)) {
            return techStack;
        }
        if (typeof techStack === 'string') {
            try {
                const parsed = JSON.parse(techStack);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.log(e);
                return techStack.split(',').map(item => item.trim()).filter(item => item);
            }
        }
        return [];
    };

    // Fetch current user and about list
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

                const aboutResponse = await fetch('http://localhost:5000/about', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const aboutData = await aboutResponse.json();
                if (aboutResponse.ok) {
                    const normalizedAbout = aboutData.map(item => ({
                        ...item,
                        techStack: normalizeTechStack(item.techStack)
                    }));
                    setAbout(normalizedAbout);
                } else {
                    alert(aboutData.error || 'Gagal mengambil data about');
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

    // Handle adding tech stack
    const handleAddTech = (e) => {
        e.preventDefault();
        if (techInput.trim() && !newAbout.techStack.includes(techInput.trim())) {
            setNewAbout({
                ...newAbout,
                techStack: [...newAbout.techStack, techInput.trim()]
            });
            setTechInput('');
        }
    };

    // Handle removing tech stack
    const handleRemoveTech = (tech) => {
        setNewAbout({
            ...newAbout,
            techStack: newAbout.techStack.filter(t => t !== tech)
        });
    };

    // Handle adding tech stack for edit form
    const handleEditAddTech = (e) => {
        e.preventDefault();
        if (techInput.trim() && !editAbout.techStack.includes(techInput.trim())) {
            setEditAbout({
                ...editAbout,
                techStack: [...editAbout.techStack, techInput.trim()]
            });
            setTechInput('');
        }
    };

    // Handle removing tech stack for edit form
    const handleEditRemoveTech = (tech) => {
        setEditAbout({
            ...editAbout,
            techStack: editAbout.techStack.filter(t => t !== tech)
        });
    };

    // Handle create about
    const handleCreateAbout = async () => {
        if (!newAbout.title || !newAbout.subtitle || !newAbout.description || !newAbout.image) {
            alert('Field title, subtitle, description, dan image wajib diisi');
            return;
        }

        const formData = new FormData();
        formData.append('title', newAbout.title);
        formData.append('subtitle', newAbout.subtitle);
        formData.append('description', newAbout.description);
        if (newAbout.resumeLink) formData.append('resumeLink', newAbout.resumeLink);
        formData.append('techStack', JSON.stringify(newAbout.techStack));
        formData.append('isActive', newAbout.isActive);
        if (newAbout.image) formData.append('image', newAbout.image);

        try {
            const response = await fetch('http://localhost:5000/about', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setAbout([...about, { ...data, techStack: normalizeTechStack(data.techStack) }]);
                setNewAbout({
                    title: '',
                    subtitle: '',
                    description: '',
                    resumeLink: '',
                    techStack: [],
                    image: null,
                    isActive: false
                });
                alert('About berhasil dibuat');
            } else {
                alert(data.error || 'Gagal membuat about');
            }
        } catch (error) {
            console.error('Error creating about:', error);
            alert('Terjadi kesalahan saat membuat about.');
        }
    };

    // Handle update about
    const handleUpdateAbout = async () => {
        if (!editAbout.title || !editAbout.subtitle || !editAbout.description) {
            alert('Field title, subtitle, dan description wajib diisi');
            return;
        }

        const formData = new FormData();
        formData.append('title', editAbout.title);
        formData.append('subtitle', editAbout.subtitle);
        formData.append('description', editAbout.description);
        if (editAbout.resumeLink) formData.append('resumeLink', editAbout.resumeLink);
        formData.append('techStack', JSON.stringify(editAbout.techStack));
        formData.append('isActive', editAbout.isActive);
        if (editAbout.image) formData.append('image', editAbout.image);

        try {
            const response = await fetch(`http://localhost:5000/about/${editAbout.uuid}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setAbout(about.map(a => a.uuid === editAbout.uuid ? { ...a, ...editAbout, profileImage: data.profileImage || a.profileImage, techStack: normalizeTechStack(editAbout.techStack) } : a));
                setEditAbout(null);
                alert('About berhasil diperbarui');
            } else {
                alert(data.error || 'Gagal memperbarui about');
            }
        } catch (error) {
            console.error('Error updating about:', error);
            alert('Terjadi kesalahan saat memperbarui about.');
        }
    };

    // Handle set active about
    const handleSetActiveAbout = async (uuid) => {
        try {
            const response = await fetch(`http://localhost:5000/about/${uuid}/active`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                setAbout(about.map(a => ({
                    ...a,
                    isActive: a.uuid === uuid ? true : false
                })));
                alert('About set as active');
            } else {
                alert(data.error || 'Gagal mengatur about sebagai aktif');
            }
        } catch (error) {
            console.error('Error setting active about:', error);
            alert('Terjadi kesalahan saat mengatur about sebagai aktif.');
        }
    };

    // Handle delete about
    const handleDeleteAbout = async (uuid) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus about ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/about/${uuid}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setAbout(about.filter(a => a.uuid !== uuid));
                alert('About berhasil dihapus');
            } else {
                alert(data.error || 'Gagal menghapus about');
            }
        } catch (error) {
            console.error('Error deleting about:', error);
            alert('Terjadi kesalahan saat menghapus about.');
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
                    About Management
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
                    {/* Create About Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Create New About
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="newTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Title
                                </label>
                                <input
                                    id="newTitle"
                                    type="text"
                                    value={newAbout.title}
                                    onChange={(e) => setNewAbout({ ...newAbout, title: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="About Title"
                                />
                            </div>
                            <div>
                                <label htmlFor="newSubtitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Subtitle
                                </label>
                                <input
                                    id="newSubtitle"
                                    type="text"
                                    value={newAbout.subtitle}
                                    onChange={(e) => setNewAbout({ ...newAbout, subtitle: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="About Subtitle"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="newDescription" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Description
                                </label>
                                <textarea
                                    id="newDescription"
                                    value={newAbout.description}
                                    onChange={(e) => setNewAbout({ ...newAbout, description: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="About Description"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label htmlFor="newResumeLink" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Resume Link (Optional)
                                </label>
                                <input
                                    id="newResumeLink"
                                    type="url"
                                    value={newAbout.resumeLink}
                                    onChange={(e) => setNewAbout({ ...newAbout, resumeLink: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="https://resume-url.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="newTechStack" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Tech Stack
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="newTechStack"
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        className="mt-1 flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="e.g., React"
                                    />
                                    <button
                                        onClick={handleAddTech}
                                        className="mt-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {newAbout.techStack.map((tech, index) => (
                                        <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded flex items-center text-xs">
                                            {tech}
                                            <button
                                                onClick={() => handleRemoveTech(tech)}
                                                className="ml-2 text-red-600 dark:text-red-400"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="newImage" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Profile Image (PNG, JPG, JPEG)
                                </label>
                                <input
                                    id="newImage"
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={(e) => setNewAbout({ ...newAbout, image: e.target.files[0] })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="newIsActive" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Set as Active
                                </label>
                                <div className="flex items-center mt-1">
                                    <input
                                        id="newIsActive"
                                        type="checkbox"
                                        checked={newAbout.isActive}
                                        onChange={(e) => setNewAbout({ ...newAbout, isActive: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    />
                                    <span className="ml-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                        Display on website
                                    </span>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <motion.button
                                    onClick={handleCreateAbout}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                >
                                    Create About
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit About Form */}
                    {editAbout && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                Edit About
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="editTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Title
                                    </label>
                                    <input
                                        id="editTitle"
                                        type="text"
                                        value={editAbout.title}
                                        onChange={(e) => setEditAbout({ ...editAbout, title: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="About Title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editSubtitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Subtitle
                                    </label>
                                    <input
                                        id="editSubtitle"
                                        type="text"
                                        value={editAbout.subtitle}
                                        onChange={(e) => setEditAbout({ ...editAbout, subtitle: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="About Subtitle"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="editDescription" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Description
                                    </label>
                                    <textarea
                                        id="editDescription"
                                        value={editAbout.description}
                                        onChange={(e) => setEditAbout({ ...editAbout, description: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="About Description"
                                        rows="4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editResumeLink" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Resume Link (Optional)
                                    </label>
                                    <input
                                        id="editResumeLink"
                                        type="url"
                                        value={editAbout.resumeLink || ''}
                                        onChange={(e) => setEditAbout({ ...editAbout, resumeLink: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="https://resume-url.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editTechStack" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tech Stack
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="editTechStack"
                                            type="text"
                                            value={techInput}
                                            onChange={(e) => setTechInput(e.target.value)}
                                            className="mt-1 flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                            placeholder="e.g., React"
                                        />
                                        <button
                                            onClick={handleEditAddTech}
                                            className="mt-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {editAbout.techStack.map((tech, index) => (
                                            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded flex items-center text-xs">
                                                {tech}
                                                <button
                                                    onClick={() => handleEditRemoveTech(tech)}
                                                    className="ml-2 text-red-600 dark:text-red-400"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="editImage" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Profile Image (Leave blank to keep unchanged)
                                    </label>
                                    <input
                                        id="editImage"
                                        type="file"
                                        accept=".png,.jpg,.jpeg"
                                        onChange={(e) => setEditAbout({ ...editAbout, image: e.target.files[0] })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    />
                                    {editAbout.profileImage && (
                                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                            Current: <a href={editAbout.profileImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">View</a>
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="editIsActive" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Set as Active
                                    </label>
                                    <div className="flex items-center mt-1">
                                        <input
                                            id="editIsActive"
                                            type="checkbox"
                                            checked={editAbout.isActive}
                                            onChange={(e) => setEditAbout({ ...editAbout, isActive: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                        />
                                        <span className="ml-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                            Display on website
                                        </span>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <motion.button
                                        onClick={handleUpdateAbout}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Update About
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setEditAbout(null)}
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

                    {/* About List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            About List
                        </h2>
                        {loading ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading about...</p>
                        ) : about.length === 0 ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No about found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-slate-700 dark:text-slate-300">
                                            <th className="p-2 sm:p-3">Title</th>
                                            <th className="p-2 sm:p-3">Subtitle</th>
                                            <th className="p-2 sm:p-3">Tech Stack</th>
                                            <th className="p-2 sm:p-3">Image</th>
                                            <th className="p-2 sm:p-3">Resume Link</th>
                                            <th className="p-2 sm:p-3">Status</th>
                                            <th className="p-2 sm:p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {about.map((item, index) => (
                                            <motion.tr
                                                key={item.uuid}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            >
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{item.title}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{item.subtitle}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {Array.isArray(item.techStack) ? item.techStack.join(', ') : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {item.profileImage ? (
                                                        <a href={item.profileImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">View</a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {item.resumeLink ? (
                                                        <a href={item.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">Link</a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {item.isActive ? (
                                                        <span className="text-green-600 dark:text-green-400 flex items-center">
                                                            <FaCheckCircle className="mr-1" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="text-yellow-600 dark:text-yellow-400">Draft</span>
                                                    )}
                                                </td>
                                                <td className="p-2 sm:p-3 flex gap-2">
                                                    {!item.isActive && (
                                                        <motion.button
                                                            onClick={() => handleSetActiveAbout(item.uuid)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500"
                                                            title="Set Active"
                                                        >
                                                            <FaCheckCircle />
                                                        </motion.button>
                                                    )}
                                                    <motion.button
                                                        onClick={() => setEditAbout({ ...item, image: null, techStack: normalizeTechStack(item.techStack) })}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDeleteAbout(item.uuid)}
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