import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function UserPageAdmin() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ userName: '', email: '', password: '', confPassword: '', role: 'user' });
    const [editUser, setEditUser] = useState(null);
    const navigate = useNavigate();

    // Fetch current user and users list
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

                const usersResponse = await fetch('http://localhost:5000/users', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const usersData = await usersResponse.json();
                if (usersResponse.ok) {
                    setUsers(usersData);
                } else {
                    alert(usersData.msg || 'Gagal mengambil data pengguna');
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

    // Handle create user
    const handleCreateUser = async () => {
        if (newUser.password !== newUser.confPassword) {
            alert('Password dan Confirm Password tidak cocok');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newUser)
            });

            const data = await response.json();

            if (response.ok) {
                setUsers([...users, { uuid: data.uuid, ...newUser }]);
                setNewUser({ userName: '', email: '', password: '', confPassword: '', role: 'user' });
                alert('User berhasil dibuat');
            } else {
                alert(data.msg || 'Gagal membuat user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Terjadi kesalahan saat membuat user.');
        }
    };

    // Handle update user
    const handleUpdateUser = async () => {
        if (editUser.password && editUser.password !== editUser.confPassword) {
            alert('Password dan Confirm Password tidak cocok');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/users/${editUser.uuid}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editUser)
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(users.map(user => user.uuid === editUser.uuid ? { ...user, ...editUser } : user));
                setEditUser(null);
                alert('User berhasil diperbarui');
            } else {
                alert(data.msg || 'Gagal memperbarui user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Terjadi kesalahan saat memperbarui user.');
        }
    };

    // Handle delete user
    const handleDeleteUser = async (uuid) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/users/${uuid}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(users.filter(user => user.uuid !== uuid));
                alert('User berhasil dihapus');
            } else {
                alert(data.msg || 'Gagal menghapus user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Terjadi kesalahan saat menghapus user.');
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
                    User Management
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
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">
                                Total Users
                            </h3>
                            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {users.length}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">
                                Admin Users
                            </h3>
                            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {users.filter(user => user.role === 'admin').length}
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

                    {/* Create User Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Create New User
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="newUserName" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Username
                                </label>
                                <input
                                    id="newUserName"
                                    type="text"
                                    value={newUser.userName}
                                    onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="Username"
                                />
                            </div>
                            <div>
                                <label htmlFor="newEmail" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email
                                </label>
                                <input
                                    id="newEmail"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label htmlFor="newConfPassword" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Confirm Password
                                </label>
                                <input
                                    id="newConfPassword"
                                    type="password"
                                    value={newUser.confPassword}
                                    onChange={(e) => setNewUser({ ...newUser, confPassword: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="newRole" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Role
                                </label>
                                <select
                                    id="newRole"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <motion.button
                                    onClick={handleCreateUser}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                >
                                    Create User
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit User Form */}
                    {editUser && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                                Edit User
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="editUserName" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Username
                                    </label>
                                    <input
                                        id="editUserName"
                                        type="text"
                                        value={editUser.userName}
                                        onChange={(e) => setEditUser({ ...editUser, userName: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="Username"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editEmail" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email
                                    </label>
                                    <input
                                        id="editEmail"
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editPassword" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Password (leave blank to keep unchanged)
                                    </label>
                                    <input
                                        id="editPassword"
                                        type="password"
                                        value={editUser.password || ''}
                                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editConfPassword" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="editConfPassword"
                                        type="password"
                                        value={editUser.confPassword || ''}
                                        onChange={(e) => setEditUser({ ...editUser, confPassword: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="editRole" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Role
                                    </label>
                                    <select
                                        id="editRole"
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                        className="mt-1 w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-white"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <motion.button
                                        onClick={handleUpdateUser}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                        Update User
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setEditUser(null)}
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

                    {/* Users Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-3">
                            Users List
                        </h2>
                        {loading ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Loading users...</p>
                        ) : users.length === 0 ? (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">No users found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-slate-700 dark:text-slate-300">
                                            <th className="p-2 sm:p-3">Username</th>
                                            <th className="p-2 sm:p-3">Email</th>
                                            <th className="p-2 sm:p-3">Role</th>
                                            <th className="p-2 sm:p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <motion.tr
                                                key={user.uuid}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            >
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{user.userName}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{user.email}</td>
                                                <td className="p-2 sm:p-3 text-slate-600 dark:text-slate-400">{user.role}</td>
                                                <td className="p-2 sm:p-3 flex gap-2">
                                                    <motion.button
                                                        onClick={() => setEditUser({ ...user, password: '', confPassword: '' })}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDeleteUser(user.uuid)}
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