import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContactModal from "./ContactModal"; // Importez le composant ContactModal

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(null); // État pour le mode desktop
  const [mobileDropdown, setMobileDropdown] = useState(null); // État pour le mode mobile
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture du modal
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fonction pour détecter si un texte est en arabe
  const isArabic = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/; // Plage Unicode pour les caractères arabes
    return arabicRegex.test(text);
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch("http://localhost:5000/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Erreur de récupération des catégories");
        }
        const categoriesData = await categoriesResponse.json();

        const levelsResponse = await fetch("http://localhost:5000/api/levels");
        if (!levelsResponse.ok) {
          throw new Error("Erreur de récupération des niveaux");
        }
        const levelsData = await levelsResponse.json();

        const formattedData = categoriesData
          .reverse()
          .reduce((acc, category) => {
            const categoryLevels = levelsData
              .filter(level => level.category === category._id)
              .map(level => ({
                nom: level.nom, // Supposons que level.nom est un objet { fr: "...", ar: "...", en: "..." }
                path: `/levels/${category._id}`,
              }))
              .reverse(); // Reverse level names for Arabic order

            acc[category.nom] = categoryLevels;
            return acc;
          }, {});

        setLevels(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur :", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setMobileDropdown(null); // Fermer le dropdown mobile
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopDropdown(null); // Fermer le dropdown desktop
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLevelClick = (path) => {
    navigate(path);
    setDesktopDropdown(null); // Fermer le dropdown desktop
    setMobileDropdown(null); // Fermer le dropdown mobile
    setIsOpen(false); // Fermer le menu mobile
  };

  // Fonction pour basculer l'état d'un dropdown mobile
  const toggleMobileDropdown = (category) => {
    setMobileDropdown((prev) => (prev === category ? null : category)); // Ouvrir ou fermer le dropdown
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="h-12 w-12 border-4 border-[#1f2a69] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-white p-4">Erreur : {error}</div>;
  }

  return (
    <nav className="bg-gradient-to-r from-[#1f2a69] to-[#123456] text-white p-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between md:flex-row-reverse rtl:flex-row-reverse">
        {/* Logo */}
        <h1 className="text-3xl font-bold tracking-widest uppercase sm:ml-2">
          <img
            src="/images/Logo.png"
            alt="Logo"
            className="h-6 w-auto cursor-pointer"
            onClick={() => navigate("/")} // Redirect to home page on click
          />
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 rtl:space-x-reverse mx-auto">
          {Object.keys(levels).map((category, index) => (
            <li
              key={index}
              className="relative group"
              ref={dropdownRef}
              onMouseEnter={() => setDesktopDropdown(category)} // Ouvrir au survol
              onMouseLeave={() => setDesktopDropdown(null)} // Fermer au départ du survol
            >
              <button
                className="text-lg font-medium flex items-center gap-1 transition-all hover:text-green-300 hover:scale-105"
              >
                {category} <ChevronDown size={16} />
              </button>

              {/* Dropdown (Desktop) */}
              <AnimatePresence>
                {desktopDropdown === category && (
                  <motion.ul
                    className="absolute right-0 mt-2 w-48 bg-white text-[#1f2a69] shadow-xl rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    dir="rtl" // Add RTL direction for dropdown
                  >
                    {levels[category].map((level, idx) => (
                      <motion.li
                        key={idx}
                        className={`p-3 transition-all cursor-pointer hover:bg-green-400 hover:text-white ${isArabic(level.nom) ? "text-right" : "text-left"}`} // Alignement dynamique
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleLevelClick(level.path)}
                      >
                        {level.nom}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* Contact Button */}
        <button
          className="hidden md:block px-4 py-3 rounded-full font-semibold text-[#1f2a69] bg-gradient-to-r from-green-400 to-green-500 transition-all hover:from-green-500 hover:to-green-600 shadow-lg transform hover:scale-105"
           // Ouvrir le modal
        >
          اتصل بنا
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden transition-all hover:scale-110 ml-4" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar Panel */}
            <motion.div
              ref={menuRef}
              className="fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-[#1f2a69] p-6 shadow-lg flex flex-col space-y-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              dir="rtl" // Add RTL direction for the entire sidebar
            >
              <button className="self-end" onClick={() => setIsOpen(false)}>
                <X size={28} />
              </button>

              {/* Mobile Menu Items with Dropdown */}
              <ul className="space-y-4 text-lg">
                {Object.keys(levels)
                  .reverse() // Reverse categories for mobile list
                  .map((category, index) => (
                    <li key={index} className="flex flex-col">
                      <button
                        className="flex items-center justify-between w-full text-white hover:text-green-400 transition-all text-right" // Align text to the right
                        onClick={() => toggleMobileDropdown(category)} // Basculer l'état du dropdown
                      >
                        {category} <ChevronDown size={16} />
                      </button>

                      {/* Dropdown (Mobile) */}
                      <AnimatePresence>
                        {mobileDropdown === category && (
                          <motion.ul
                            className="mt-2 bg-white text-[#1f2a69] shadow-xl rounded-lg overflow-hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            dir="rtl" // Add RTL direction for dropdown
                          >
                            {levels[category].map((level, idx) => (
                              <motion.li
                                key={idx}
                                className={`p-3 transition-all cursor-pointer hover:bg-green-400 hover:text-white ${isArabic(level.nom) ? "text-right" : "text-left"}`} // Alignement dynamique
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleLevelClick(level.path)}
                              >
                                {level.nom}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
              </ul>

              {/* Contact Button (Now in Sidebar) */}
              <button
                className="mt-6 px-4 py-3 w-full rounded-full font-semibold text-[#1f2a69] bg-gradient-to-r from-green-400 to-green-500 transition-all hover:from-green-500 hover:to-green-600 shadow-lg transform hover:scale-105" 
                path='/Footer.jsx' // Ouvrir le modal
              >
                اتصل بنا
              </button>

              {/* Social Media Icons */}
              <div className="flex justify-center mt-6">
                {[
                  { icon: Facebook, link: "https://www.facebook.com/nataalam.org" },
                  { icon: Instagram, link: "https://www.instagram.com/nataalamcenter/m" },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank" // Opens the link in a new tab
                    rel="noopener noreferrer" // Recommended for security with target="_blank"
                  >
                    <motion.div
                      className="p-3 rounded-full bg-white bg-opacity-10 cursor-pointer transition-all hover:bg-opacity-20 shadow-md"
                      whileHover={{ scale: 1.2, boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)" }}
                    >
                      <item.icon size={24} />
                    </motion.div>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;