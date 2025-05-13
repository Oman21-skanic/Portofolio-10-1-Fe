import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
    const [heroData, setHeroData] = useState({
        title: "Hello, I'm",
        subtitle: 'Web Developer',
        description: "Passionate about building fast, functional, and beautiful websites. Let's turn your vision into reality."
    });

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch('http://localhost:5000/hero/active');
                if (!response.ok) throw new Error('Failed to fetch active hero data');
                const data = await response.json();
                setHeroData(data);
            } catch (error) {
                console.error('Error fetching active hero data:', error);
            }
        };
        fetchHeroData();
    }, []);

    return (
        <section className="h-screen flex items-center px-6 md:px-8 pt-20 bg-white dark:bg-slate-900" id="home">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                        <span className="text-slate-900 dark:text-white">{heroData.title}</span><br />
                        <span className="text-blue-600 dark:text-blue-400">{heroData.subtitle}</span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl max-w-lg text-slate-600 dark:text-slate-300">
                        {heroData.description}
                    </p>

                    <div className="mt-10 flex gap-4">
                        <motion.a
                            href="#projects"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View Projects
                        </motion.a>
                        <motion.a
                            href="#about"
                            className="px-6 py-3 border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Learn More
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}