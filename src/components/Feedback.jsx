import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiMessageSquare, FiStar, FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const navigate = useNavigate();
    const [newFeedback, setNewFeedback] = useState({
        comment: "",
        rating: 0,
    });
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch("http://localhost:5000/feedback", {
                credentials: "include",
            });
            const data = await response.json();
            setFeedbacks(data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newFeedback.comment && newFeedback.rating > 0) {
            try {
                // Fetch current user
                const meResponse = await fetch("http://localhost:5000/me", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!meResponse.ok) {
                    navigate("/login");
                    return;
                }
                const meData = await meResponse.json();
                const feedbackData = {
                    name: meData.userName, // Ambil userName dari respons /me
                    comment: newFeedback.comment,
                    rating: newFeedback.rating,
                };

                const response = await fetch("http://localhost:5000/feedback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(feedbackData),
                });
                if (response.ok) {
                    const feedback = await response.json();
                    setFeedbacks([feedback, ...feedbacks]);
                    setNewFeedback({ comment: "", rating: 0 });
                } else {
                    console.error("Failed to submit feedback");
                }
            } catch (error) {
                console.error("Error submitting feedback:", error);
            }
        }
    };

    return (
        <section id="feedback" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                        Your <span className="text-blue-600 dark:text-blue-400">Feedback</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Share your thoughts and rate my portfolio
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Feedback Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
                    >
                        <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">
                            Add Your Feedback
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="absolute top-3 left-3 text-slate-500 dark:text-slate-400">
                                    <FiMessageSquare />
                                </div>
                                <textarea
                                    value={newFeedback.comment}
                                    onChange={(e) =>
                                        setNewFeedback({ ...newFeedback, comment: e.target.value })
                                    }
                                    placeholder="Your feedback..."
                                    rows="4"
                                    className="w-full bg-transparent border-b-2 border-slate-300 dark:border-slate-600 py-3 pl-10 pr-2 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-600 dark:text-slate-400">Rating:</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setNewFeedback({ ...newFeedback, rating: star })
                                            }
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="text-2xl focus:outline-none"
                                        >
                                            <FiStar
                                                className={`${(hoverRating || newFeedback.rating) >= star
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-slate-300 dark:text-slate-600"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                            >
                                <FiSend className="w-5 h-5" />
                                Submit Feedback
                            </button>
                        </form>
                    </motion.div>


                    {/* Feedback Display */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
                    >
                        <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">
                            What People Say
                        </h3>
                        <div className="max-h-[400px] overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-slate-200 dark:scrollbar-track-slate-800">
                            {feedbacks.map((feedback) => (
                                <div
                                    key={feedback.uuid}
                                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-slate-800 dark:text-white">
                                            {feedback.name}
                                        </h4>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FiStar
                                                    key={star}
                                                    className={`w-5 h-5 ${feedback.rating >= star
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-slate-300 dark:text-slate-600"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400">{feedback.comment}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}