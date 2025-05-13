import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CertificatePage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCertificate, setNewCertificate] = useState({
        title: '',
        issuer: '',
        date: '',
        credentialUrl: '',
        image: null
    });
    const [editCertificate, setEditCertificate] = useState(null);
    const navigate = useNavigate();

    // Fetch current user and certificates list
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

                const certificatesResponse = await fetch('http://localhost:5000/certificate', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const certificatesData = await certificatesResponse.json();
                if (certificatesResponse.ok) {
                    setCertificates(certificatesData);
                } else {
                    alert(certificatesData.error || 'Gagal mengambil data sertifikat');
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

    // Handle create certificate
    const handleCreateCertificate = async () => {
        if (!newCertificate.title || !newCertificate.issuer || !newCertificate.date) {
            alert('Field title, issuer, dan date wajib diisi');
            return;
        }

        const formData = new FormData();
        formData.append('title', newCertificate.title);
        formData.append('issuer', newCertificate.issuer);
        formData.append('date', newCertificate.date);
        if (newCertificate.credentialUrl) formData.append('credentialUrl', newCertificate.credentialUrl);
        if (newCertificate.image) formData.append('image', newCertificate.image);

        try {
            const response = await fetch('http://localhost:5000/certificate', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setCertificates([...certificates, data]);
                setNewCertificate({ title: '', issuer: '', date: '', credentialUrl: '', image: null });
                alert('Sertifikat berhasil dibuat');
            } else {
                alert(data.error || 'Gagal membuat sertifikat');
            }
        } catch (error) {
            console.error('Error creating certificate:', error);
            alert('Terjadi kesalahan saat membuat sertifikat.');
        }
    };

    // Handle update certificate
    const handleUpdateCertificate = async () => {
        if (!editCertificate.title || !editCertificate.issuer || !editCertificate.date) {
            alert('Field title, issuer, dan date wajib diisi');
            return;
        }

        const formData = new FormData();
        formData.append('title', editCertificate.title);
        formData.append('issuer', editCertificate.issuer);
        formData.append('date', editCertificate.date);
        if (editCertificate.credentialUrl) formData.append('credentialUrl', editCertificate.credentialUrl);
        if (editCertificate.image) formData.append('image', editCertificate.image);

        try {
            const response = await fetch(`http://localhost:5000/certificate/${editCertificate.uuid}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setCertificates(certificates.map(cert => cert.uuid === editCertificate.uuid ? { ...cert, ...editCertificate, imageUrl: data.imageUrl || cert.imageUrl } : cert));
                setEditCertificate(null);
                alert('Sertifikat berhasil diperbarui');
            } else {
                alert(data.error || 'Gagal memperbarui sertifikat');
            }
        } catch (error) {
            console.error('Error updating certificate:', error);
            alert('Terjadi kesalahan saat memperbarui sertifikat.');
        }
    };

    // Handle delete certificate
    const handleDeleteCertificate = async (uuid) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/certificate/${uuid}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setCertificates(certificates.filter(cert => cert.uuid !== uuid));
                alert('Sertifikat berhasil dihapus');
            } else {
                alert(data.error || 'Gagal menghapus sertifikat');
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
            alert('Terjadi kesalahan saat menghapus sertifikat.');
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
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                    Certificate Management
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
                                Total Certificates
                            </h3>
                            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {certificates.length}
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

                    {/* Create Certificate Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Create New Certificate
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="newTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Title
                                </label>
                                <input
                                    id="newTitle"
                                    type="text"
                                    value={newCertificate.title}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Certificate Title"
                                />
                            </div>
                            <div>
                                <label htmlFor="newIssuer" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Issuer
                                </label>
                                <input
                                    id="newIssuer"
                                    type="text"
                                    value={newCertificate.issuer}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Issuer Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="newDate" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Date
                                </label>
                                <input
                                    id="newDate"
                                    type="date"
                                    value={newCertificate.date}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="newCredentialUrl" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Credential URL (Optional)
                                </label>
                                <input
                                    id="newCredentialUrl"
                                    type="url"
                                    value={newCertificate.credentialUrl}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="https://credential-url.com"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="newImage" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Certificate Image (PNG, JPG, JPEG, PDF)
                                </label>
                                <input
                                    id="newImage"
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    onChange={(e) => setNewCertificate({ ...newCertificate, image: e.target.files[0] })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <motion.button
                                    onClick={handleCreateCertificate}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                >
                                    Create Certificate
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit Certificate Form */}
                    {editCertificate && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                Edit Certificate
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="editTitle" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Title
                                    </label>
                                    <input
                                        id="editTitle"
                                        type="text"
                                        value={editCertificate.title}
                                        onChange={(e) => setEditCertificate({ ...editCertificate, title: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Certificate Title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editIssuer" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Issuer
                                    </label>
                                    <input
                                        id="editIssuer"
                                        type="text"
                                        value={editCertificate.issuer}
                                        onChange={(e) => setEditCertificate({ ...editCertificate, issuer: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Issuer Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editDate" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Date
                                    </label>
                                    <input
                                        id="editDate"
                                        type="date"
                                        value={editCertificate.date}
                                        onChange={(e) => setEditCertificate({ ...editCertificate, date: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editCredentialUrl" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Credential URL (Optional)
                                    </label>
                                    <input
                                        id="editCredentialUrl"
                                        type="url"
                                        value={editCertificate.credentialUrl || ''}
                                        onChange={(e) => setEditCertificate({ ...editCertificate, credentialUrl: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="https://credential-url.com"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="editImage" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Certificate Image (Leave blank to keep unchanged)
                                    </label>
                                    <input
                                        id="editImage"
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.pdf"
                                        onChange={(e) => setEditCertificate({ ...editCertificate, image: e.target.files[0] })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    />
                                    {editCertificate.imageUrl && (
                                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                            Current: <a href={editCertificate.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">View</a>
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <motion.button
                                        onClick={handleUpdateCertificate}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Update Certificate
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setEditCertificate(null)}
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

                    {/* Certificates Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Certificates List
                        </h2>
                        {loading ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading certificates...</p>
                        ) : certificates.length === 0 ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No certificates found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-slate-700 dark:text-slate-300">
                                            <th className="p-2 sm:p-3">Title</th>
                                            <th className="p-2 sm:p-3">Issuer</th>
                                            <th className="p-2 sm:p-3">Date</th>
                                            <th className="p-2 sm:p-3">Image</th>
                                            <th className="p-2 sm:p-3">Credential URL</th>
                                            <th className="p-2 sm:p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {certificates.map((cert, index) => (
                                            <motion.tr
                                                key={cert.uuid}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            >
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{cert.title}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{cert.issuer}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{new Date(cert.date).toLocaleDateString()}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {cert.imageUrl ? (
                                                        <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">View</a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">
                                                    {cert.credentialUrl ? (
                                                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">Link</a>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="p-2 sm:p-3 flex gap-2">
                                                    <motion.button
                                                        onClick={() => setEditCertificate({ ...cert, image: null })}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDeleteCertificate(cert.uuid)}
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