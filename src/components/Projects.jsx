import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/project');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();

                // Normalize techStack data
                const normalizedProjects = data.map(project => ({
                    ...project,
                    techStack: ensureArray(project.techStack)
                }));

                setProjects(normalizedProjects);
            } catch (err) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Helper function to ensure techStack is always an array
    const ensureArray = (techStack) => {
        if (!techStack) return [];
        if (Array.isArray(techStack)) return techStack;
        if (typeof techStack === 'string') {
            try {
                return JSON.parse(techStack);
            } catch {
                return techStack.split(',').map(t => t.trim());
            }
        }
        return [];
    };

    if (loading) return (
        <div className="py-20 text-center">
            <p>Loading projects...</p>
        </div>
    );

    if (error) return (
        <div className="py-20 text-center text-red-500">
            <p>Error: {error}</p>
        </div>
    );

    return (
        <section id="projects" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ margin: "-50px" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                        My <span className="text-blue-600 dark:text-blue-400">Project</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Here are some of the projects I've worked on.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <motion.div
                            key={project.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="h-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200 dark:border-slate-700">

                                {/* Project Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={'http://localhost:5000' + project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

                                    />
                                </div>

                                {/* Project Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {project.category || "Web Application"}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack - AMAN DARI ERROR */}
                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.techStack.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Project Links */}
                                    <div className="flex gap-3">
                                        {project.demoUrl && (
                                            <motion.a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ y: -2 }}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                                            >
                                                <FiExternalLink size={16} />
                                                Live Demo
                                            </motion.a>
                                        )}
                                        {project.githubUrl && (
                                            <motion.a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ y: -2 }}
                                                className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                                            >
                                                <FiGithub size={16} />
                                                View Code
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}