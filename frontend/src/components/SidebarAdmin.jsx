import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Folder, Book, PlusCircle, Menu, LogOut } from "lucide-react";
import Swal from "sweetalert2";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
      // Automatically open sidebar on big screens
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatically open sidebar on big screens when component mounts
  useEffect(() => {
    if (screenSize >= 1024) {
      setIsOpen(true);
    }
  }, [screenSize]);

  // Menu items for the sidebar
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={22} /> },
    { path: "/admin/GestionStructure", label: "Gestion Structure", icon: <Folder size={22} /> },
    { path: "/admin/AjoutDonnees", label: "Ajout de Données", icon: <PlusCircle size={22} /> },
  ];

  // Handle logout with confirmation
  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous êtes sur le point de vous déconnecter.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    });
  };

  return (
    <div className="relative">
      {/* Toggle Button for Small Screens */}
      {screenSize < 1024 && (
        <button
          className="fixed top-2 left-4 z-50 bg-custom-blue2 text-white p-2 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={28} />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -250 }} // Initial position (off-screen)
            animate={{ x: 0 }} // Animate to visible position
            exit={{ x: -250 }} // Animate to off-screen when closing
            transition={{ duration: 0.3 }} // Smooth transition
            className={`fixed lg:relative h-screen bg-custom-blue2  text-white shadow-lg flex flex-col justify-between p-4 transition-all duration-300 w-64 z-40`}
          >
            {/* Sidebar Header */}
            <div className="text-xl font-bold text-center uppercase mb-6"></div>

            {/* Menu Items */}
            <ul className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  className="flex items-center gap-4 w-full px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-200 hover:text-black transition-all duration-300"
                  onClick={() => {
                    navigate(item.path);
                    if (screenSize < 1024) setIsOpen(false); // Close sidebar on mobile after navigation
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </ul>

            {/* Logout Button */}
            <button
              className="flex items-center gap-4 w-full px-3 py-3 rounded-lg text-gray-300 hover:bg-red-800 transition-all duration-300"
              onClick={handleLogout}
            >
              <LogOut size={22} />
              <span>Déconnexion</span>
            </button>

            {/* Footer */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarAdmin;