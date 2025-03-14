import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileText, Video, File, BookOpen, Clipboard, PlayCircle } from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CoursePage = () => {
  const { subjectId } = useParams(); // Extract subjectId from the URL
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resourceTypes, setResourceTypes] = useState({});
  const [resources, setResources] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openResourceType, setOpenResourceType] = useState(null); // Nouvel état pour suivre le type de ressource ouvert
  const [subjectName, setSubjectName] = useState("");
  const [levelName, setLevelName] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");

  // Fonction pour détecter si le texte est en arabe
  const isArabic = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subject details
        const subjectRes = await axios.get(`http://localhost:5000/api/subjects/${subjectId}`);
        setSubjectName(subjectRes.data.nom);

        // Fetch level name based on subject.level
        const levelRes = await axios.get(`http://localhost:5000/api/levels/id/${subjectRes.data.level}`);
        setLevelName(levelRes.data.nom);
        setLevel(levelRes.data._id);
        // Fetch category name based on level.category
        const categoryRes = await axios.get(`http://localhost:5000/api/categories/id/${levelRes.data.category}`);
        setCategoryName(categoryRes.data.nom);
        setCategory(categoryRes.data._id);
        // Fetch courses for the subject
        const coursesRes = await axios.get(`http://localhost:5000/api/courses/subject/${subjectId}`);
        setCourses(coursesRes.data);
      } catch (error) {
        setError("خطأ أثناء تحميل الدروس.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const fetchResourceTypes = async (courseId) => {
    if (resourceTypes[courseId]) {
      setOpenDropdown(openDropdown === courseId ? null : courseId);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/typeressources/cours/${courseId}`);
      setResourceTypes((prev) => ({ ...prev, [courseId]: response.data }));
      setOpenDropdown(courseId);
    } catch (error) {
      console.error("Erreur lors du chargement des types de ressources", error);
    }
  };

  const fetchResources = async (typeResourceId) => {
    if (resources[typeResourceId] && openResourceType === typeResourceId) {
      // Si le type de ressource est déjà ouvert, fermez-le
      setOpenResourceType(null);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/ressources/typeressources/${typeResourceId}`);
      setResources((prev) => ({ ...prev, [typeResourceId]: response.data }));
      setOpenResourceType(typeResourceId); // Ouvrir le type de ressource
    } catch (error) {
      console.error("Erreur lors du chargement des ressources", error);
    }
  };

  const handleResourceClick = (ressourcesId) => {
    navigate(`/ressources/${ressourcesId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader2 className="h-16 w-auto text-[#1f2a69] animate-spin" />
      </div>
    );
  }
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Animation variants for the list of courses
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  const courseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-b blue-50  to-white min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto font-arabic min-h-screen" dir="rtl">
        {/* Titre de la catégorie aligné à gauche */}
        <div className="mt-14 h-16 lg:h-32 bg-blue-50 lg:p-10 text-right lg:mb-2 flex items-center">
          <h1 className="lg:text-4xl text-3xl font-extrabold text-blue-800">
            {`${levelName} : ${subjectName}`}
          </h1>
        </div>

        {/* Fil d'Ariane */}
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center text-gray-600 text-sm lg:text-lg mb-4">
            <Link
              to="/"
              className="flex font-bold items-center text-black-600 hover:text-blue-800 transition-all duration-300"
            >
              الرئيسية
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <Link
              to={`/levels/${category}`}
              className="text-black-600 font-bold hover:text-blue-600 transition-all duration-300"
            >
              {categoryName}
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <Link
              to={`/levels/${category}`}
              className="text-black-600 font-bold hover:text-blue-600 transition-all duration-300"
            >
              {levelName}
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <Link
              className="text-black-600 font-bold hover:text-blue-600 transition-all duration-300"
            >
              {subjectName}
            </Link>
          </div>

          {/* Contenu principal */}
          <motion.div
            className="bg-white lg:pl-8 lg:pr-8 lg:pt-6 lg:pb-6 p-2 rounded-2xl space-y-6 shadow-2xl mt-4 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courses.length > 0 ? (
              courses.map((course) => (
                <motion.div
                  key={course._id}
                  className="mb-6"
                  variants={courseVariants}
                >
                  <motion.div
                    className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                      openDropdown === course._id
                        ? "border-blue-500 shadow-lg" // Bordure bleue lorsque ouvert
                        : "border-gray-200 hover:border-blue-500" // Bordure grise par défaut, bleue au survol
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.button
                      onClick={() => fetchResourceTypes(course._id)}
                      className="w-full flex justify-between items-center bg-gradient-to-r from-blue-50 to-white text-blue-800 p-5 text-lg font-bold transition-all duration-300 hover:bg-blue-100"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      dir={isArabic(course.title) ? "rtl" : "ltr"} // Ajuster la direction en fonction de la langue
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-500" />
                        <span style={{ textAlign: isArabic(course.title) ? "right" : "left" }}>
                          {course.title}
                        </span>
                      </div>
                      {openDropdown === course._id ? <FaChevronUp /> : <FaChevronDown />}
                    </motion.button>
                    <AnimatePresence>
                      {openDropdown === course._id && resourceTypes[course._id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {resourceTypes[course._id].length > 0 ? (
                            resourceTypes[course._id].map((type) => (
                              <div key={type._id} className="mt-3 ml-4 mr-4">
                                <motion.div
                                  className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                                    openResourceType === type._id
                                      ? "border-green-500 shadow-lg" // Bordure verte lorsque ouvert
                                      : "border-gray-200 hover:border-green-500" // Bordure grise par défaut, verte au survol
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  style={{ width: "calc(100% - 2rem)" }}
                                >
                                  <motion.button
                                    onClick={() => fetchResources(type._id)}
                                    className="w-full flex justify-between items-center bg-gradient-to-r from-blue-50 to-white text-green-700 p-4 text-lg transition-all hover:bg-green-100 font-bold"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.95 }}
                                    dir={isArabic(type.nom) ? "rtl" : "ltr"} // Ajuster la direction en fonction de la langue
                                  >
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="h-6 w-6 text-green-500" />
                                      <span style={{ textAlign: isArabic(type.nom) ? "right" : "left" }}>
                                        {type.nom}
                                      </span>
                                    </div>
                                    {openResourceType === type._id ? <FaChevronUp /> : <FaChevronDown />}
                                  </motion.button>
                                  <AnimatePresence>
                                    {openResourceType === type._id && resources[type._id] && (
                                      <motion.ul
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-4 space-y-2"
                                      >
                                        {resources[type._id].length > 0 ? (
                                          resources[type._id].map((resource) => (
                                            <motion.li
                                            key={resource._id}
                                            onClick={() => handleResourceClick(resource._id)}
                                            className="py-3 px-4 flex rounded-md bg-white hover:bg-green-100 hover:font-extrabold active:bg-blue-300 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            dir={isArabic(resource.title) ? "rtl" : "ltr"} // Appliquer dir en fonction de la langue
                                          >
                                            <span style={{ textAlign: isArabic(resource.title) ? "right" : "left" }}>
                                              {resource.title}
                                            </span>
                                          </motion.li>
                                          ))
                                        ) : (
                                          <li className="text-gray-500">لا توجد موارد متاحة لهذا النوع.</li>
                                        )}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 p-4">لا توجد أنواع من الموارد لهذا الدرس.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                
                <p className="text-gray-500 mt-4">لا توجد دروس متاحة لهذه المادة.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursePage;