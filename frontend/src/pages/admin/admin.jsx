import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarAdmin from "../../components/SidebarAdmin";
import NavbarAdmin from "../../components/NavbarAdmin";
import axios from "axios";

const Admin = () => {
  const [stats, setStats] = useState({
    totalRessources: 0,
    totalTelechargements: 0,
    totalVues: 0,
  });

  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/stats"); // Replace with your API URL
        setStats(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des statistiques :", error);
      }
    };

    if (location.pathname === "/admin/dashboard") {
      fetchStats();
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <NavbarAdmin />

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Content (Only on Dashboard Page) */}
          {location.pathname === "/admin/dashboard" && (
            <>
              <h1 className="text-2xl font-bold mb-4">Bienvenue dans l’espace Admin</h1>

              {/* 📊 Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold">📚 Ressources</h2>
                  <p className="text-3xl font-bold">{stats.totalRessources}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold">⬇️ Téléchargements</h2>
                  <p className="text-3xl font-bold">{stats.totalTelechargements}</p>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold">👀 Vues</h2>
                  <p className="text-3xl font-bold">{stats.totalVues}</p>
                </div>
              </div>
            </>
          )}

          {/* Content for Other Pages */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;