import { motion } from "framer-motion";
import { FiExternalLink, FiCalendar, FiAward } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function Certificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default image path
    const DEFAULT_CERT_IMAGE = '/images/default-certificate.jpg';

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await fetch('http://localhost:5000/certificate');
                if (!response.ok) throw new Error('Failed to fetch certificates');
                const data = await response.json();

                // Normalize data - ensure image URLs are valid
                const normalizedCerts = data.map(cert => ({
                    ...cert,
                    imageUrl: cert.imageUrl || DEFAULT_CERT_IMAGE
                }));

                setCertificates(normalizedCerts);
            } catch (err) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    // Handle image loading errors
    // const handleImageError = (e) => {
    //     console.error(`Failed to load image: ${e.target.src}`);
    //     e.target.src = DEFAULT_CERT_IMAGE;
    //     e.target.alt = 'Default certificate image';
    // };

    if (loading) return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6 max-w-6xl text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-3 text-slate-600 dark:text-slate-400">Loading certificates...</p>
            </div>
        </section>
    );

    if (error) return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6 max-w-6xl text-center">
                <p className="text-red-500">Error loading certificates: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        </section>
    );

    return (
        <section id="certificates" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ margin: "-50px" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                        My <span className="text-blue-600 dark:text-blue-400">Certifications</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Recognitions of my skills and knowledge
                    </p>
                </motion.div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.uuid || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            viewport={{ margin: "-50px" }}
                            whileHover={{ y: -5 }}
                            className="flex"
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col flex-grow border border-slate-200 dark:border-slate-700">
                                {/* Certificate Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <motion.img
                                        src={'http://localhost:5000' + cert.imageUrl}
                                        alt={cert.title}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        // onError={handleImageError}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                {/* Certificate Content */}
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">
                                        {cert.title}
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <FiAward className="text-blue-500 dark:text-blue-400" />
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {cert.issuer}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FiCalendar className="text-blue-500 dark:text-blue-400" />
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {cert.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Button */}
                                <div className="px-6 pb-6">
                                    <motion.a
                                        href={cert.credentialUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg transition-colors ${cert.credentialUrl
                                            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                                            : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <FiExternalLink className="mr-2" />
                                        {cert.credentialUrl ? 'Verify Certificate' : 'Unavailable'}
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}