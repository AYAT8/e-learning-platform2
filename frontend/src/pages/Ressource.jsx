import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PdfViewer from "../components/PdfViewer"; // Import du composant PDF
import VideoPlayer from "../components/VideoPlayer"; // Import du composant Video
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const RessourcePage = () => {
  const { ressourcesId } = useParams();
  const [ressource, setRessource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false); // État pour gérer l'affichage plein écran
  const [expandedImageIndex, setExpandedImageIndex] = useState(null); // État pour gérer l'image agrandie
  const [category, setCategory] = useState(null); // État pour la catégorie
  const [level, setLevel] = useState(null); // État pour le niveau
  const [subject, setSubject] = useState(null); // État pour la matière
  const [cours, setCours] = useState(null); // État pour le cours
  const [typeRessource, setTypeRessource] = useState(null); // État pour le type de ressource

  // Fonction pour détecter si le texte est en arabe
  const isArabic = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la ressource
        const ressourceRes = await axios.get(`http://localhost:5000/api/ressources/${ressourcesId}`);
        setRessource(ressourceRes.data);

        // Récupérer le cours
        const coursRes = await axios.get(`http://localhost:5000/api/courses/${ressourceRes.data.id_course._id}`);
        setCours(coursRes.data);

        // Récupérer le type de ressource
        const typeRessourceRes = await axios.get(`http://localhost:5000/api/typeressources/${ressourceRes.data.id_type_ressource._id}`);
        setTypeRessource(typeRessourceRes.data);

        // Récupérer la matière (subject)
        const subjectRes = await axios.get(`http://localhost:5000/api/subjects/${ressourceRes.data.id_subject._id}`);
        setSubject(subjectRes.data);

        // Récupérer le niveau (level)
        const levelRes = await axios.get(`http://localhost:5000/api/levels/id/${subjectRes.data.level}`);
        setLevel(levelRes.data);

        // Récupérer la catégorie (category)
        const categoryRes = await axios.get(`http://localhost:5000/api/categories/id/${levelRes.data.category}`);
        setCategory(categoryRes.data);

        setLoading(false);
      } catch (err) {
        setError("Impossible de charger la ressource.");
        setLoading(false);
      }
    };
    fetchData();
  }, [ressourcesId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse bg-gray-200 h-12 w-48 mx-auto mb-4 rounded-lg"></div>
          <div className="animate-pulse bg-gray-200 h-8 w-64 mx-auto rounded-lg"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center">
          {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-custom-gray">
      <NavBar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen bg-white-50 mx-auto font-arabic min-h-screen"
        dir="rtl"
      >
        <div className="max-w-screen mt-12 lg:mt-12 md:mt-20 h-16 lg:h-32 bg-blue-50 lg:p-10 text-right  flex items-center">
          <h1 className="lg:text-4xl text-2xl font-extrabold font-almarai text-blue-800">
            <span className="mr-2"></span> {subject?.nom} :{ressource.title}
          </h1>
        </div>
        <div className="lg:m-36 lg:mt-0 sm:m-8 lg:p-6 mt-0 bg-white ">
          {/* Header avec dégradé */}

          {/* Fil d'Ariane */}
          <div className="max-w-screen mx-auto p-4">
            <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm lg:text-lg">
              <Link
                to="/"
                className="font-bold text-black-600 hover:text-blue-800 transition-all duration-300"
              >
                الرئيسية
              </Link>
              <span className="text-gray-400">&gt;</span>
              <Link
                to={`/levels/${category?._id}`}
                className="font-bold text-black-600 hover:text-blue-600 transition-all duration-300"
              >
                {category?.nom}
              </Link>
              <span className="text-gray-400">&gt;</span>
              <Link
                to={`/levels/${category?._id}`}
                className="font-bold text-black-600 hover:text-blue-600 transition-all duration-300"
              >
                {level?.nom}
              </Link>
              <span className="text-gray-400">&gt;</span>
              <Link
                to={`/subjects/${subject?._id}`}
                className="font-bold text-black-600 hover:text-blue-600 transition-all duration-300"
              >
                {subject?.nom}
              </Link>
              <span className="text-gray-400">&gt;</span>
              <Link
                className="font-bold text-black-600 hover:text-blue-600 transition-all duration-300"
              >
                {ressource.title}
              </Link>
            </div>
            <div className="flex space-x-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs sm:text-sm mt-2">
                {cours?.title} {/* Nom du cours */}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm mt-2">
                {typeRessource?.nom} {/* Type de ressource */}
              </span>
            </div>
          </div>

          {/* Description */}
          {ressource.description && (
            <p className="text-gray-600 text-lg mt-4 text-center max-w-2xl mx-auto">
              {ressource.description}
            </p>
          )}

          {/* Contenu principal (PDF, vidéo ou message d'erreur) */}
          <div className="bg-white  p-4 lg:p-4 lg:rounded-2xl md:shadow-lg mt-2 md:hover:shadow-xl transition-shadow duration-300 md:border-2 border-gray-300">
            {/* Badges pour le nom du cours et le type de ressource */}
            <h1
              className="lg:text-2xl text-2xl font-bold text-purple-600"
              dir={isArabic(ressource.title) ? "rtl" : "ltr"} // Appliquer dir en fonction de la langue
            >
              <span style={{ textAlign: isArabic(ressource.title) ? "right" : "left" }}>
                {ressource.title}
              </span>
            </h1>

            {ressource.url.endsWith(".pdf") ? (
              <div className="flex flex-col items-center">
                <PdfViewer url={ressource.url} title={ressource.title} />
              </div>
            ) : ressource.url.endsWith(".mp4") ||
              ressource.url.endsWith(".webm") ||
              ressource.url.endsWith(".ogg") ? (
              <div className="flex flex-col items-center p-8 ">
                {/* Cadre stylé pour la vidéo */}
                <div className=" max-w-5xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all  hover:shadow-3xl border-2 border-gray-700">
                  <VideoPlayer url={ressource.url} title={ressource.title} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {ressource.images
                  .flat() // Aplatir le tableau si nécessaire
                  .slice(0, 4) // Limiter à 4 images
                  .map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer"
                      onClick={() => {
                        setIsImageExpanded(true);
                        setExpandedImageIndex(index);
                      }}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  ))}
              </div>
            )}

            {isImageExpanded && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                <img
                  src={ressource.images[expandedImageIndex]}
                  alt={`Expanded Image ${expandedImageIndex + 1}`}
                  className="max-w-full max-h-full rounded-lg"
                />
                <button
                  onClick={() => setIsImageExpanded(false)}
                  className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Bouton de téléchargement */}
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default RessourcePage;