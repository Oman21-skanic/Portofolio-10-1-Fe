import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProjectPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        category: '',
        demoUrl: '',
        githubUrl: '',
        techStack: [],
        image: null
    });
    const [editProject, setEditProject] = useState(null);
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
                return techStack.split(',').map(item => item.trim()).filter(item => item);
            }
        }
        return [];
    };

    // Fetch current user and projects list
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

                const projectsResponse = await fetch('http://localhost:5000/project', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const projectsData = await projectsResponse.json();
                if (projectsResponse.ok) {
                    const normalizedProjects = projectsData.map(project => ({
                        ...project,
                        techStack: normalizeTechStack(project.techStack)
                    }));
                    setProjects(normalizedProjects);
                } else {
                    alert(projectsData.error || 'Gagal mengambil data proyek');
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
        if (techInput.trim() && !newProject.techStack.includes(techInput.trim())) {
            setNewProject({
                ...newProject,
                techStack: [...newProject.techStack, techInput.trim()]
            });
            setTechInput('');
        }
    };

    // Handle removing tech stack
    const handleRemoveTech = (tech) => {
        setNewProject({
            ...newProject,
            techStack: newProject.techStack.filter(t => t !== tech)
        });
    };

    // Handle adding tech stack for edit form
    const handleEditAddTech = (e) => {
        e.preventDefault();
        if (techInput.trim() && !editProject.techStack.includes(techInput.trim())) {
            setEditProject({
                ...editProject,
                techStack: [...editProject.techStack, techInput.trim()]
            });
            setTechInput('');
        }
    };

    // Handle removing tech stack for edit form
    const handleEditRemoveTech = (tech) => {
        setEditProject({
            ...editProject,
            techStack: editProject.techStack.filter(t => t !== tech)
        });
    };

    // Handle create project
    const handleCreateProject = async () => {
        if (!newProject.title || !newProject.description || !newProject.category) {
            alert('Field title, description, dan category wajib diisi');
            return;
        }

        const formData = new FormData();
        formData.append('title', newProject.title);
        formData.append('description', newProject.description);
        formData.append('category', newProject.category);
        if (newProject.demoUrl) formData.append('demoUrl', newProject.demoUrl);
        if (newProject.githubUrl) formData.append('githubUrl', newProject.githubUrl);
        formData.append('techStack', JSON.stringify(newProject.techStack));
        if (newProject.image) formData.append('image', newProject.image);

        try {
            const response = await fetch('http://localhost:5000/project', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setProjects([...projects, { ...data, techStack: normalizeTechStack(data.techStack) }]);
                setNewProject({
                    title: '',
                    description: '',
                    category: '',
                    demoUrl: '',
                    githubUrl: '',
                    techStack: [],
                    image: null
                });
                alert('Proyek berhasil dibuat');
            } else {
                alert(data.error || 'Gagal membuat proyek');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Terjadi kesalahan saat membuat proyek.');
        }
    };

    // Handle update project
    const handleUpdateProject = async () => {
        if (!editProject.title || !editProject.description || !editProject.category) {
            alert('Field title, description, dan category wajib diisi');
            return;
        }

        const formData = new FormData();
        formData.append('title', editProject.title);
        formData.append('description', editProject.description);
        formData.append('category', editProject.category);
        if (editProject.demoUrl) formData.append('demoUrl', editProject.demoUrl);
        if (editProject.githubUrl) formData.append('githubUrl', editProject.githubUrl);
        formData.append('techStack', JSON.stringify(editProject.techStack));
        if (editProject.image) {
            formData.append('image', editProject.image);
        }

        try {
            const response = await fetch(`http://localhost:5000/project/${editProject.uuid}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setProjects(projects.map(proj => proj.uuid === editProject.uuid ? { ...proj, ...editProject, imageUrl: data.imageUrl || proj.imageUrl } : proj));
                setEditProject(null);
                alert('Proyek berhasil diperbarui');
            } else {
                alert(data.error || 'Gagal memperbarui proyek');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Terjadi kesalahan saat memperbarui proyek.');
        }
    };

    // Handle delete project
    const handleDeleteProject = async (uuid) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/project/${uuid}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setProjects(projects.filter(proj => proj.uuid !== uuid));
                alert('Proyek berhasil dihapus');
            } else {
                alert(data.error || 'Gagal menghapus proyek');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Terjadi kesalahan saat menghapus proyek.');
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
                    Project Management
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
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">
                                Total Projects
                            </h3>
                            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {projects.length}
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

                    {/* Create Project Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Create New Project
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="new GrassTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Title
                                </label>
                                <input
                                    id="newTitle"
                                    type="text"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Project Title"
                                />
                            </div>
                            <div>
                                <label htmlFor="newCategory" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Category
                                </label>
                                <input
                                    id="newCategory"
                                    type="text"
                                    value={newProject.category}
                                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="e.g., Web Development"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="newDescription" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Description
                                </label>
                                <textarea
                                    id="newDescription"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Project Description"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label htmlFor="newDemoUrl" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Demo URL (Optional)
                                </label>
                                <input
                                    id="newDemoUrl"
                                    type="url"
                                    value={newProject.demoUrl}
                                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="https://demo-url.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="newGithubUrl" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    GitHub URL (Optional)
                                </label>
                                <input
                                    id="newGithubUrl"
                                    type="url"
                                    value={newProject.githubUrl}
                                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>
                            <div className="sm:col-span-2">
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
                                    {newProject.techStack.map((tech, index) => (
                                        <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded flex items-center text-xs sm:text-sm">
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
                            <div className="sm:col-span-2">
                                <label htmlFor="newImage" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Project Image (PNG, JPG, JPEG, PDF)
                                </label>
                                <input
                                    id="newImage"
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <motion.button
                                    onClick={handleCreateProject}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                >
                                    Create Project
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit Project Form */}
                    {editProject && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                Edit Project
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="editTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Title
                                    </label>
                                    <input
                                        id="editTitle"
                                        type="text"
                                        value={editProject.title}
                                        onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Project Title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editCategory" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Category
                                    </label>
                                    <input
                                        id="editCategory"
                                        type="text"
                                        value={editProject.category}
                                        onChange={(e) => setEditProject({ ...editProject, category: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="e.g., Web Development"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="editDescription" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Description
                                    </label>
                                    <textarea
                                        id="editDescription"
                                        value={editProject.description}
                                        onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Project Description"
                                        rows="4"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editDemoUrl" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Demo URL (Optional)
                                    </label>
                                    <input
                                        id="editDemoUrl"
                                        type="url"
                                        value={editProject.demoUrl || ''}
                                        onChange={(e) => setEditProject({ ...editProject, demoUrl: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="https://demo-url.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editGithubUrl" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        GitHub URL (Optional)
                                    </label>
                                    <input
                                        id="editGithubUrl"
                                        type="url"
                                        value={editProject.githubUrl || ''}
                                        onChange={(e) => setEditProject({ ...editProject, githubUrl: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                                <div className="sm:col-span-2">
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
                                        {editProject.techStack.map((tech, index) => (
                                            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded flex items-center text-xs sm:text-sm">
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
                                <div className="sm:col-span-2">
                                    <label htmlFor="editImage" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Project Image (Leave blank to keep unchanged)
                                    </label>
                                    <input
                                        id="editImage"
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.pdf"
                                        onChange={(e) => setEditProject({ ...editProject, image: e.target.files[0] || `http://localhost:5000${editProject.imageUrl}` })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    />
                                    {editProject.imageUrl && (
                                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                            Current: <a href={`http://localhost:5000${editProject.imageUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">View</a>
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <motion.button
                                        onClick={handleUpdateProject}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Update Project
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setEditProject(null)}
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

                    {/* Projects Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Projects List
                        </h2>
                        {loading ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading projects...</p>
                        ) : projects.length === 0 ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No projects found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-slate-700 dark:text-slate-300">
                                            <th className="p-2 sm:p-3">Title</th>
                                            <th className="p-2 sm:p-3">Category</th>
                                            <th className="p-2 sm:p-3">Tech Stack</th>
                                            <th className="p-2 sm:p-3">Image</th>
                                            <th className="p-2 sm:p-3">Demo URL</th>
                                            <th className="p-2 sm:p-3">GitHub URL</th>
                                            <th className="p-2 sm:p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((proj, index) => (
                                            <motion.tr
                                                key={proj.uuid}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            >
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{proj.title}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{proj.category}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {proj.imageUrl ? (
                                                        <a href={`http://localhost:5000${proj.imageUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">View</a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {proj.demoUrl ? (
                                                        <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">Link</a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {proj.githubUrl ? (
                                                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">Link</a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 flex gap-2">
                                                    <motion.button
                                                        onClick={() => setEditProject({ ...proj, image: null, techStack: normalizeTechStack(proj.techStack) })}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDeleteProject(proj.uuid)}
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