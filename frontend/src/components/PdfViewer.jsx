import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import { Loader } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfViewer = ({ url, title }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [subject, setSubject] = useState(null); // État pour la matière
  const { ressourcesId } = useParams();
  const [ressource, setRessource] = useState(null); // État pour la ressource
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [error, setError] = useState(null); // État pour les erreurs

  // Récupérer la ressource et la matière
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la ressource
        const ressourceRes = await axios.get(`http://localhost:5000/api/ressources/${ressourcesId}`);
        setRessource(ressourceRes.data);

        // Récupérer la matière (subject)
        const subjectRes = await axios.get(`http://localhost:5000/api/subjects/${ressourceRes.data.id_subject._id}`);
        setSubject(subjectRes.data);
      } catch (err) {
        setError("Impossible de charger la ressource.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ressourcesId]); // Déclencher uniquement lorsque ressourcesId change

  // Générer les miniatures PDF
  useEffect(() => {
    generatePDFThumbnails(url);
  }, [url]);

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedIndex !== null) {
        switch (event.key) {
          case "Escape":
            setSelectedIndex(null); // Fermer l'image en grand
            break;
          case "ArrowLeft":
            if (selectedIndex < thumbnails.length - 1) {
              setSelectedIndex(selectedIndex + 1); // Image suivante
            }
            break;
          case "ArrowRight":
            if (selectedIndex > 0) {
              setSelectedIndex(selectedIndex - 1); // Image précédente
            }
            break;
          default:
            break;
        }
      }
    };

    // Ajouter l'écouteur d'événements
    window.addEventListener("keydown", handleKeyDown);

    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, thumbnails.length]); // Déclencher uniquement lorsque selectedIndex ou thumbnails.length change

  const generatePDFThumbnails = async (pdfUrl) => {
    try {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const pages = [];
      for (let i = 1; i <= Math.min(pdf.numPages, 4); i++) {
        const page = await pdf.getPage(i);
        const scale = 3;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        pages.push(canvas.toDataURL("image/png"));
      }
      setThumbnails(pages);
    } catch (err) {
      console.error("Erreur lors du rendu des miniatures PDF :", err);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const fileName = url.split("/").pop();

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };

  const navigateImage = (direction) => {
    let newIndex = selectedIndex + direction;

    if (newIndex < 0) {
      newIndex = selectedIndex; // Ne pas aller en dessous de 0
    } else if (newIndex >= thumbnails.length) {
      newIndex = selectedIndex; // Ne pas dépasser la dernière image
    }

    setSelectedIndex(newIndex);
  };

  return (
    <div className="mt-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          {thumbnails.length > 0 ? (
            <div
            className={`grid gap-4 ${
              thumbnails.length === 4 
                ? "grid-cols-2 sm:grid-cols-4" // 4 colonnes
                : thumbnails.length === 3 
                  ? "grid-cols-2 sm:grid-cols-3" // 3 colonnes, 2 en petits écrans
                  : thumbnails.length === 2 
                    ? "grid-cols-2" // 2 colonnes, 2 en petits écrans
                    : "grid-cols-1" // 1 colonne
            }`}
            
            >
              {thumbnails.map((thumb, index) => (
                <motion.img
                  key={index}
                  src={thumb}
                  alt={`Page ${index + 1}`}
                  className="w-48 h-64 border-2 border-black rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-md px-6 py-3 bg-custom-blue text-white text-lg font-semibold rounded-lg hover:bg-blue-700 text-center"
            >
              فتح الوثيقة
            </a>
            <button
              onClick={handleDownload}
              className="w-full max-w-md px-6 py-3 bg-custom-green text-white text-lg font-semibold rounded-lg hover:bg-green-700 text-center"
            >
              تحميل الوثيقة
            </button>
            <button
              onClick={() => {
                if (ressource && ressource.id_subject) {
                  window.location.href = `/courses/subject/${ressource.id_subject._id}`;
                } else {
                  console.error("Ressource ou sujet non disponible.");
                }
              }}
              className="w-full max-w-md px-6 py-3 bg-white text-gray-800 text-lg font-semibold rounded-lg hover:bg-gray-100 text-center"
            >
              الرجوع
            </button>
          </div>

          {/* Affichage de l'image en grand avec animation */}
          <AnimatePresence>
            {selectedIndex !== null && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  className="absolute top-6 right-6 text-white text-2xl font-bold hover:text-gray-400"
                  onClick={() => setSelectedIndex(null)}
                >
                  ✕
                </button>

                <button
                  className={`absolute left-4 text-white text-3xl font-bold ${
                    selectedIndex === thumbnails.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:text-gray-400"
                  }`}
                  onClick={() => navigateImage(1)} // Image suivante
                  disabled={selectedIndex === thumbnails.length - 1}
                >
                  🡠
                </button>

                <button
                  className={`absolute right-4 text-white text-3xl font-bold ${
                    selectedIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:text-gray-400"
                  }`}
                  onClick={() => navigateImage(-1)} // Image précédente
                  disabled={selectedIndex === 0}
                >
                  🡢
                </button>

                <div
                  className={`max-w-6xl max-h-screen transition-transform ${
                    isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <motion.img
                    key={selectedIndex}
                    src={thumbnails[selectedIndex]}
                    alt="Affichage en grand"
                    className={`max-h-screen rounded-lg shadow-2xl transition-transform ${
                      isZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default PdfViewer;