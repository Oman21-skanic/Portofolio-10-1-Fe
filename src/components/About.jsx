import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function About() {
    const [aboutData, setAboutData] = useState({
        title: "About Me",
        subtitle: "Full-Stack Developer Based in Indonesia",
        description: "I specialize in building modern web applications with focus on performance, accessibility, and clean design. With 5+ years of experience, I help startups and businesses bring their ideas to life.\n\nMy approach combines technical excellence with user-centered design principles to create products that people love to use.",
        profileImage: "../../public/images/profile.jpg",
        resumeLink: "/resume",
        techStack: [
            "React.js",
            "UI/UX Design",
            "Node.js",
            "TypeScript",
            "Figma",
            "Motion Design"
        ]
    });

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch('http://localhost:5000/about/active');
                if (!response.ok) throw new Error('Failed to fetch active about data');
                const data = await response.json();
                // Normalize techStack to ensure it's always an array
                const normalizedTechStack = Array.isArray(data.techStack)
                    ? data.techStack
                    : (typeof data.techStack === 'string' && data.techStack
                        ? JSON.parse(data.techStack).filter(item => typeof item === 'string')
                        : []);
                setAboutData({
                    ...data,
                    techStack: normalizedTechStack,
                    description: data.description ? data.description.replace(/\n/g, '\n\n') : aboutData.description
                });
            } catch (error) {
                console.error('Error fetching active about data:', error);
            }
        };
        fetchAboutData();
    }, []);

    const handleDownload = () => {
        window.gtag('event', 'download', {
            'file_name': 'CV',
        });
    };

    return (
        <section id="about" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-blue-600 dark:text-blue-400">About</span>{" "}
                        <span className="text-slate-800 dark:text-white">Me</span>
                    </h2>
                    <div className="w-20 h-1 bg-blue-500 dark:bg-blue-400 mx-auto"></div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Profile Image - Simple but elegant */}
                    {aboutData.profileImage && (
                        <div className="lg:w-2/5">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <img
                                    src={aboutData.profileImage}
                                    alt="Profile"
                                    className="rounded-lg shadow-md w-full max-w-md mx-auto border-2 border-slate-200 dark:border-slate-700"
                                />
                                <div className="absolute -z-10 inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg translate-x-4 translate-y-4 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
                            </motion.div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="lg:w-3/5">
                        <motion.h3
                            className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-white"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            {aboutData.subtitle}
                        </motion.h3>

                        <motion.div
                            className="prose dark:prose-invert mb-8 text-slate-600 dark:text-slate-300"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            {aboutData.description.split('\n\n').map((paragraph, index) => (
                                <p key={index} className={index > 0 ? 'mt-4' : ''}>
                                    {paragraph}
                                </p>
                            ))}
                        </motion.div>

                        {/* Tech Stack - Minimalist tags */}
                        {aboutData.techStack && aboutData.techStack.length > 0 && (
                            <motion.div
                                className="flex flex-wrap gap-3 mb-10"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                viewport={{ once: true }}
                            >
                                {aboutData.techStack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </motion.div>
                        )}

                        {/* CTA Button */}
                        {aboutData.resumeLink && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                viewport={{ once: true }}
                            >
                                <motion.a
                                    href={aboutData.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleDownload}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                                    View Resume
                                </motion.a>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}