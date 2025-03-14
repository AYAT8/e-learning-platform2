"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaEye, FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import EditModal from "../../components/EditModal2"; // Importez le composant EditModal
import { motion, AnimatePresence } from "framer-motion"; // Importez Framer Motion

const GestionCoursById = () => {
    const { subjectId } = useParams();
    const [courses, setCourses] = useState([]);
    const [subjectName, setSubjectName] = useState("");
    const [typeRessources, setTypeRessources] = useState({});
    const [ressources, setRessources] = useState({});
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [openResources, setOpenResources] = useState({});

    // États pour la gestion des modales
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [entityToEdit, setEntityToEdit] = useState(null);
    const [entityType, setEntityType] = useState("");

    // Charger les cours
    useEffect(() => {
        if (!subjectId) return;

        fetch(`http://localhost:5000/api/courses/subject/${subjectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => {
            setCourses(data);
            data.forEach(course => loadTypeRessources(course._id));
        })
        .catch(err => console.error("Erreur lors du chargement des cours:", err));
    }, [subjectId]);

    // Charger le nom de la matière
    useEffect(() => {
        if (!subjectId) return;

        fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => setSubjectName(data.nom))
        .catch(err => console.error("Erreur lors du chargement de la matière:", err));
    }, [subjectId]);

    // Charger les types de ressources pour un cours
    const loadTypeRessources = (courseId) => {
        fetch(`http://localhost:5000/api/typeRessources/cours/${courseId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => {
            setTypeRessources(prev => ({ ...prev, [courseId]: data }));
            data.forEach(type => loadRessources(type._id));
        })
        .catch(err => console.error(`Erreur lors du chargement des types de ressources pour le cours ${courseId}:`, err));
    };

    // Charger les ressources pour un type de ressource
    const loadRessources = (typeRessourceId) => {
        fetch(`http://localhost:5000/api/ressources/typeressources/${typeRessourceId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => {
            setRessources(prev => ({ ...prev, [typeRessourceId]: data }));
        })
        .catch(err => console.error(`Erreur lors du chargement des ressources pour le type ${typeRessourceId}:`, err));
    };

    // Basculer l'affichage des cours
    const toggleDropdown = (id) => {
        setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Basculer l'affichage des ressources
    const toggleResources = (typeId) => {
        setOpenResources(prev => ({ ...prev, [typeId]: !prev[typeId] }));
    };

    // Télécharger une ressource
    const handleDownload = async (url) => {
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

    // Supprimer un élément (cours, type de ressource ou ressource)
    const handleDelete = async (id, endpoint, name) => {
        const result = await Swal.fire({
          title: "Êtes-vous sûr?",
          text: `Vous êtes sur le point de supprimer "${name}". Cette action est irréversible !`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Oui, supprimer !",
          cancelButtonText: "Annuler",
        });
    
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem("adminToken");
            const headers = { Authorization: `Bearer ${token}` };
    
            const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}`, {
              method: "DELETE",
              headers,
            });
    
            if (!response.ok) {
              throw new Error("Erreur lors de la suppression");
            }
    
            // Rafraîchir les données après la suppression
            if (endpoint === "courses") {
              const updatedCourses = courses.filter((course) => course._id !== id);
              setCourses(updatedCourses);
            } else if (endpoint === "typeRessources") {
              const updatedTypeRessources = { ...typeRessources };
              for (const courseId in updatedTypeRessources) {
                updatedTypeRessources[courseId] = updatedTypeRessources[courseId].filter((type) => type._id !== id);
              }
              setTypeRessources(updatedTypeRessources);
            } else if (endpoint === "ressources") {
              const updatedRessources = { ...ressources };
              for (const typeId in updatedRessources) {
                updatedRessources[typeId] = updatedRessources[typeId].filter((ressource) => ressource._id !== id);
              }
              setRessources(updatedRessources);
            }
    
            // Afficher un message de succès
            Swal.fire({
              title: "Supprimé !",
              text: `"${name}" a été supprimé avec succès.`,
              icon: "success",
              timer: 2000, // Fermer automatiquement après 2 secondes
              showConfirmButton: false,
            });
          } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            Swal.fire({
              title: "Erreur",
              text: "Une erreur s'est produite lors de la suppression.",
              icon: "error",
            });
          }
        }
    };

    // Ouvrir la modale de modification
    const openEditModal = (entity, type) => {
        setEntityToEdit(entity);
        setEntityType(type);
        setEditModalOpen(true);
    };

    // Fermer la modale de modification
    const closeEditModal = () => {
        setEditModalOpen(false);
        setEntityToEdit(null);
        setEntityType("");
    };

    // Sauvegarder les modifications
    const handleSave = async (formData) => {
        try {
            const token = localStorage.getItem("adminToken");
            const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

            let endpoint = "";
            switch (entityType) {
                case "course":
                    endpoint = "courses";
                    break;
                case "typeRessource":
                    endpoint = "typeRessources";
                    break;
                case "ressource":
                    endpoint = "ressources";
                    break;
                default:
                    throw new Error("Type d'entité non reconnu");
            }

            const response = await fetch(`http://localhost:5000/api/${endpoint}/${entityToEdit._id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la modification");
            }

            // Rafraîchir les données après la modification
            const fetchData = async () => {
                const [coursesRes, typeRessourcesRes, ressourcesRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/courses/subject/${subjectId}`, { headers }).then((res) => res.json()),
                    fetch(`http://localhost:5000/api/typeRessources/cours/${entityToEdit._id}`, { headers }).then((res) => res.json()),
                    fetch(`http://localhost:5000/api/ressources/typeressources/${entityToEdit._id}`, { headers }).then((res) => res.json()),
                ]);

                setCourses(coursesRes);
                setTypeRessources(prev => ({ ...prev, [entityToEdit._id]: typeRessourcesRes }));
                setRessources(prev => ({ ...prev, [entityToEdit._id]: ressourcesRes }));
            };

            await fetchData();

            // Afficher un message de succès
            Swal.fire({
                title: "Modifié !",
                text: `"${formData.title}" a été modifié avec succès.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            closeEditModal();
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur s'est produite lors de la modification.",
                icon: "error",
            });
        }
    };

    // Animation variants
    const listVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="md:p-10 bg-gray-100 min-h-screen font-arabic" dir="rtl">
            <h1 className="text-4xl  font-extrabold mb-8">📚 إدارة الدروس</h1>
            <h2 className="text-2xl font-semibold mb-6">المادة: {subjectName || "جار التحميل..."}</h2>

            {courses.map(course => (
                <motion.div
                    key={course._id}
                    className="bg-white p-4 rounded-xl shadow-md mb-2 "
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleDropdown(course._id)}>
                        <span className="text-lg font-semibold">{course.title}</span>
                        <div className="flex gap-2">
                            <FaEdit
                                className="text-blue-600 cursor-pointer"
                                title="Modifier le cours"
                                onClick={(e) => {
                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                    openEditModal(course, "course");
                                }}
                            />
                            <FaTrash
                                className="text-red-600 cursor-pointer"
                                title="Supprimer le cours"
                                onClick={(e) => {
                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                    handleDelete(course._id, "courses", course.title);
                                }}
                            />
                            {openDropdowns[course._id] ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        
                    </div>
                    <AnimatePresence>
                        {openDropdowns[course._id] && (
                            <motion.div
                                variants={listVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {typeRessources[course._id]?.map(type => (
                                    <motion.div
                                        key={type._id}
                                        className="mt-3 p-3 bg-gray-200 rounded-lg"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleResources(type._id)}>
                                            <h3 className="font-medium">{type.nom}</h3>
                                            <div className="flex gap-2">
                                                <FaEdit
                                                    className="text-blue-600 cursor-pointer"
                                                    title="Modifier le type de ressource"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Empêcher la propagation de l'événement
                                                        openEditModal(type, "typeRessource");
                                                    }}
                                                />
                                                <FaTrash
                                                    className="text-red-600 cursor-pointer"
                                                    title="Supprimer le type de ressource"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Empêcher la propagation de l'événement
                                                        handleDelete(type._id, "typeRessources", type.nom);
                                                    }}
                                                />
                                                {openResources[type._id] ? <FaChevronUp /> : <FaChevronDown />}
                                            </div>
                                            
                                        </div>
                                        <AnimatePresence>
                                            {openResources[type._id] && (
                                                <motion.div
                                                    variants={listVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                >
                                                    {ressources[type._id]?.map(ressource => (
                                                        <motion.div
                                                            key={ressource._id}
                                                            className="flex justify-between items-center p-2 bg-white rounded-lg mt-2"
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                        >
                                                            <span>{ressource.title}</span>
                                                            <div className="flex gap-2">
                                                                <FaEdit
                                                                    className="text-blue-600 cursor-pointer"
                                                                    title="Modifier la ressource"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Empêcher la propagation de l'événement
                                                                        openEditModal(ressource, "ressource");
                                                                    }}
                                                                />
                                                                <FaTrash
                                                                    className="text-red-600 cursor-pointer"
                                                                    title="Supprimer la ressource"
                                                                    onClick={() => handleDelete(ressource._id, "ressources", ressource.title)}
                                                                />
                                                                <a href={ressource.url} target="_blank" rel="noopener noreferrer">
                                                                    <FaEye className="text-green-600 cursor-pointer" title="Afficher" />
                                                                </a>
                                                                <FaDownload
                                                                    className="text-gray-600 cursor-pointer"
                                                                    title="Télécharger"
                                                                    onClick={() => handleDownload(ressource.url)}
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}

            {/* Modale de modification */}
            <EditModal
                isOpen={editModalOpen}
                onClose={closeEditModal}
                entity={entityToEdit}
                onSave={handleSave}
                type={entityType}
            />
        </div>
    );
};

export default GestionCoursById;