import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-100 dark:bg-slate-900 py-16 px-6 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* About Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                            About Me
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Passionate web developer creating modern, responsive websites with cutting-edge technologies.
                        </p>
                        <div className="text-sm text-slate-500 dark:text-slate-500">
                            © {currentYear} All Rights Reserved
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                            Contact
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <a
                                    href="https://maps.google.com?q=Jakarta,Indonesia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Jakarta, Indonesia
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <FaPhone className="text-blue-500" />
                                <a
                                    href="tel:+6281234567890"
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    +62 812-3456-7890
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <FaEnvelope className="text-blue-500" />
                                <a
                                    href="mailto:hello@example.com"
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    hello@example.com
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {['Home', 'About', 'Projects', 'Contact', 'Feedback'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* My Location */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                            My Location
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Find me in Bogor, Indonesia.
                        </p>
                        <div className="w-full h-40 rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.4894669995047!2d106.75623947452134!3d-6.585915564379508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5457e0e3bcf%3A0x58481d58737539c0!2sSMK%20Negeri%201%20Ciomas!5e0!3m2!1sid!2sid!4v1746619942433!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </motion.div>
                </div>

                {/* Social Links & Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex gap-6">
                        {[
                            { icon: <FaGithub />, url: 'https://github.com' },
                            { icon: <FaLinkedin />, url: 'https://linkedin.com' },
                            { icon: <FaInstagram />, url: 'https://instagram.com' }
                        ].map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -3 }}
                                className="text-xl text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-500 text-center md:text-right">
                        <p>Designed & Built with ❤️</p>
                        <p>© {currentYear} All Rights Reserved</p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}