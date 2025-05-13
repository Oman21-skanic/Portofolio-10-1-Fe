import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SkillBar = ({ level }) => (
    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
        <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            transition={{ duration: 1.5 }}
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
        />
    </div>
);

export default function Skills() {
    const [skillsData, setSkillsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/skills/grouped')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Gagal mengambil data skill');
                }
                return res.json();
            })
            .then(data => {
                // Pastikan data adalah objek dan filter kategori yang bukan array
                const validData = typeof data === 'object' && data !== null
                    ? Object.fromEntries(
                        Object.entries(data).filter(([_, items]) => Array.isArray(items) && items.length > 0)
                    )
                    : {};
                setSkillsData(validData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching skills:', error);
                setError('Gagal memuat skill. Silakan coba lagi.');
                setSkillsData({});
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section id="skills" className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-6 max-w-6xl">
                    <p className="text-center text-slate-600 dark:text-slate-400">Loading skills...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="skills" className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-6 max-w-6xl">
                    <p className="text-center text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="skills" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                        My <span className="text-blue-600 dark:text-blue-400">Skills</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Technologies and tools I use to create exceptional digital experiences
                    </p>
                </motion.div>

                {/* Grid Skill */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(skillsData).length === 0 ? (
                        <p className="text-center text-slate-600 dark:text-slate-400 col-span-2">
                            No skills available.
                        </p>
                    ) : (
                        Object.entries(skillsData).map(([category, items], index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                                    {category}
                                </h3>

                                <div className="space-y-5">
                                    {Array.isArray(items) && items.length > 0 ? (
                                        items.map((skill, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="group"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={skill.iconUrl}
                                                            alt={skill.name}
                                                            className="w-6 h-6"
                                                            onError={(e) => {
                                                                e.target.src = 'https://cdn.simpleicons.org/simpleicons/gray';
                                                            }}
                                                        />
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {skill.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                        {skill.level}%
                                                    </span>
                                                </div>
                                                <SkillBar level={skill.level} />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-slate-600 dark:text-slate-400">No skills in this category.</p>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}