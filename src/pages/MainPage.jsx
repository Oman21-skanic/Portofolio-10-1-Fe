import Cursor from "../components/Cursor";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Certificates from "../components/Certificates";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";

export default function MainPage() {
    return (
        <div className="min-h-screen bg-[#F1EFEC] dark:bg-[#0f172a]">
            <Cursor />
            <Header />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Certificates />
            <Feedback />
            <Footer />
        </div>
    );
}