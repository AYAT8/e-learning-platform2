import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../components/SidebarAdmin";
import NavbarAdmin from "../../components/NavbarAdmin";
import axios from "axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRessources: 0,
        totalTelechargements: 0,
        totalVues: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/stats"); // Remplace par ton URL API
                setStats(response.data);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des statistiques :", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <SidebarAdmin />

            {/* Contenu Principal */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <NavbarAdmin />

                {/* Contenu Dynamique */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Bienvenue dans l’espace Admin</h1>

                    {/* 📊 Statistiques */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">📚 Ressources</h2>
                            <p className="text-3xl font-bold">{stats.totalRessources}</p>
                        </div>
                        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">⬇️ Téléchargements</h2>
                            <p className="text-3xl font-bold">{stats.totalTelechargements}</p>
                        </div>
                        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">👀 Vues</h2>
                            <p className="text-3xl font-bold">{stats.totalVues}</p>
                        </div>
                    </div>

                    {/* Contenu des autres pages */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
