import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Cursor from '../components/Cursor';
import UserPageAdmin from '../components/adminComponents/UserPageAdmin';
import DashboardPage from '../components/adminComponents/DashboardPage';
import SideBarAdmin from '../components/adminComponents/SideBarAdmin';
import CertificatePage from '../components/adminComponents/CertificatePage';
import ProjectPage from '../components/adminComponents/ProjectPage';
import SkillPage from '../components/adminComponents/SkillPage';
import AboutPage from '../components/adminComponents/AboutPage';
import HeroPage from '../components/adminComponents/HeroPage';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/');
            } else {
                alert(data.msg || 'Logout failed');
            }
        } catch (error) {
            alert('Error during logout. Try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F1EFEC] dark:bg-[#0f172a] flex">
            <Cursor />
            <SideBarAdmin
                handleLogout={handleLogout}
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <div className="flex-1 transition-all duration-300">
                <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/hero" element={<HeroPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/users" element={<UserPageAdmin />} />
                    <Route path="/certificates" element={<CertificatePage />} />
                    <Route path="/projects" element={<ProjectPage />} />
                    <Route path="/skills" element={<SkillPage />} />
                </Routes>
            </div>
        </div>
    );
}