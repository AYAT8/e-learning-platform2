import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaHome } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const LevelSelection = () => {
  const { category } = useParams();
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLevel, setOpenLevel] = useState(null);
  const [openFiliere, setOpenFiliere] = useState(null);
  const [categoryName, setCategoryName] = useState("فئة غير معروفة");

  // Fonction pour détecter si le texte est en arabe
  const isArabic = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelsRes, subjectsRes, filieresRes, categoriesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/levels/${category}`),
          axios.get("http://localhost:5000/api/subjects"),
          axios.get("http://localhost:5000/api/filieres"),
          axios.get("http://localhost:5000/api/categories"),
        ]);

        setLevels(levelsRes.data);
        setSubjects(subjectsRes.data);
        setFilieres(filieresRes.data);

        // Trouver la catégorie correspondante
        const foundCategory = categoriesRes.data.find(cat => cat._id === category);
        if (foundCategory) {
          setCategoryName(foundCategory.nom);
        }
      } catch (error) {
        console.error("Erreur de chargement :", error);
        setError("خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader2 className="h-16 w-auto text-[#1f2a69] animate-spin" />
      </div>
    );
  }
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Animation variants for the list of levels
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  const levelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-b blue-50 to-white min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto font-arabic" dir="rtl">
        {/* Titre de la catégorie aligné à gauche */}
        <div className="mt-14 h-16 lg:h-32 bg-blue-50 lg:p-10 text-right lg:mb-2 flex items-center">
          <h1 className="lg:text-5xl text-4xl font-extrabold text-blue-800">
            {categoryName}
          </h1>
        </div>

        {/* Contenu principal centré */}
        <div className="max-w-3xl mx-auto p-4">
          {/* Fil d'Ariane */}
          <div className="flex items-center text-gray-600 text-lg mb-4">
            <Link
              to="/"
              className="flex font-bold items-center text-black-600 hover:text-blue-800 transition-all duration-300"
            >
              الرئيسية
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span> {/* Séparateur moderne */}
            <Link
              className="text-black-600 font-bold hover:text-blue-600 transition-all duration-300"
            >
              {categoryName}
            </Link>
          </div>

          {/* Contenu principal */}
          <motion.div
            className="bg-white pl-8 pr-8 pt-6 pb-6 rounded-2xl space-y-6 shadow-2xl mt-4 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {levels.length > 0 ? (
              levels.map((level) => (
                <motion.div
                  key={level._id}
                  className="mb-6"
                  variants={levelVariants}
                >
                  <motion.div
                    className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                      openLevel === level._id
                        ? "border-blue-500 shadow-lg" // Bordure bleue lorsque ouvert
                        : "border-black-800 hover:border-blue-500" // Bordure grise par défaut, bleue au survol
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <button
                      onClick={() => {
                        setOpenLevel(openLevel === level._id ? null : level._id);
                        setOpenFiliere(null);
                      }}
                      className="w-full flex justify-between items-center bg-gradient-to-r from-blue-50 to-white text-blue-800 p-5 text-lg font-bold transition-all duration-300 hover:bg-blue-100"
                      dir={isArabic(level.nom) ? "rtl" : "ltr"} // Appliquer dir en fonction de la langue
                    >
                      <div className="flex items-center gap-2">
                        <img src="/images/pie-chart (3).png" alt="icon" className="h-6 w-6" />
                        <span style={{ textAlign: isArabic(level.nom) ? "right" : "left" }}>
                          {level.nom}
                        </span>
                      </div>
                      {openLevel === level._id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <AnimatePresence>
                      {openLevel === level._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {category === "67b0b07d5ecd650d2c369c7f" ? (
                            filieres.filter(filiere => filiere.level === level._id).length > 0 ? (
                              filieres.filter(filiere => filiere.level === level._id).map((filiere) => (
                                <div key={filiere._id} className="mt-3 ml-4 mr-4"> {/* Adjusted margin for filiere boxes */}
                                  <motion.div
                                    className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                                      openFiliere === filiere._id
                                        ? "border-green-500 shadow-lg" // Bordure verte lorsque ouvert
                                        : "border-gray-200 hover:border-green-500" // Bordure grise par défaut, verte au survol
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    style={{ width: "calc(100% - 2rem)" }} // Reduce width of filiere boxes
                                  >
                                    <button
                                      onClick={() => setOpenFiliere(openFiliere === filiere._id ? null : filiere._id)}
                                      className="w-full flex justify-between items-center bg-gradient-to-r from-blue-50 to-white text-green-700 p-4 text-lg transition-all hover:bg-green-100 font-bold"
                                      dir={isArabic(filiere.nom) ? "rtl" : "ltr"} // Appliquer dir en fonction de la langue
                                    >
                                      <div className="flex items-center gap-2">
                                        <img src="/images/pie-chart (2).png" alt="icon" className="h-6 w-6" />
                                        <span style={{ textAlign: isArabic(filiere.nom) ? "right" : "left" }}>
                                          {filiere.nom}
                                        </span>
                                      </div>
                                      {openFiliere === filiere._id ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                    <AnimatePresence>
                                      {openFiliere === filiere._id && (
                                        <motion.ul
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="p-4 space-y-2"
                                        >
                                          {subjects.filter(subject => subject.filiere === filiere._id).map((subject) => (
                                            <motion.li
                                              key={subject._id}
                                              className="py-3 px-4 rounded-md bg-white  hover:bg-green-100 hover:font-extrabold active:bg-blue-300 transition-all"
                                              whileHover={{ scale: 1.02 }}
                                              dir={isArabic(subject.nom) ? "rtl" : "ltr"} // Appliquer dir en fonction de la langue
                                            >
                                              <Link to={`/courses/subject/${subject._id}`} className="block" style={{ textAlign: isArabic(subject.nom) ? "right" : "left" }}>
                                                {subject.nom}
                                              </Link>
                                            </motion.li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">لا توجد فروع متاحة لهذا المستوى.</p>
                            )
                          ) : (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 p-4"
                            >
                              {subjects.filter(subject => subject.level === level._id).map((subject) => (
                                <motion.li
                                  key={subject._id}
                                  className="py-3 px-4 rounded-md bg-white hover:bg-blue-200 hover:font-extrabold active:bg-blue-300 transition-all"
                                  whileHover={{ scale: 1.02 }}
                                  dir={isArabic(subject.nom) ? "rtl" : "ltr"} // Appliquer dir en fonction de la langue
                                >
                                  <Link to={`/courses/subject/${subject._id}`} className="block" style={{ textAlign: isArabic(subject.nom) ? "right" : "left" }}>
                                    {subject.nom}
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center">لا توجد مستويات متاحة.</p>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LevelSelection;