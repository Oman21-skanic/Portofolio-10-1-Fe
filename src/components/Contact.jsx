import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiSend, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feedback: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Feedback submitted:', formData);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', feedback: '' });

        // Reset submission status after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const formVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <section id="contact" className="min-h-screen flex items-center px-6 py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 dark:text-white">
                        Share Your <span className="text-blue-600 dark:text-blue-400">Feedback</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        I'd love to hear your thoughts about my work or potential collaborations
                    </p>
                </motion.div>

                {isSubmitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg"
                    >
                        <p className="text-center font-medium">
                            Thank you for your feedback! I'll get back to you soon.
                        </p>
                    </motion.div>
                ) : (
                    <motion.form
                        variants={formVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-6"
                    >
                        <motion.div variants={itemVariants} className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 dark:text-slate-400">
                                <FiUser />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full bg-transparent border-b-2 border-slate-300 dark:border-slate-600 py-4 pl-10 pr-2 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 dark:text-slate-400">
                                <FiMail />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full bg-transparent border-b-2 border-slate-300 dark:border-slate-600 py-4 pl-10 pr-2 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative">
                            <div className="absolute top-4 left-3 text-slate-500 dark:text-slate-400">
                                <FiMessageSquare />
                            </div>
                            <textarea
                                name="feedback"
                                value={formData.feedback}
                                onChange={handleChange}
                                placeholder="Your feedback or message..."
                                rows="5"
                                className="w-full bg-transparent border-b-2 border-slate-300 dark:border-slate-600 py-4 pl-10 pr-2 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none"
                                required
                            ></textarea>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-6"
                        >
                            <motion.button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium text-lg w-full md:w-auto transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiSend className="w-5 h-5" />
                                Send Feedback
                            </motion.button>
                        </motion.div>
                    </motion.form>
                )}
            </div>
        </section>
    );
}