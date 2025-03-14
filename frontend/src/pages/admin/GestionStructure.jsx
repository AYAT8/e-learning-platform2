"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditModal from "../../components/EditModal"; // Importez le composant EditModal
import { motion, AnimatePresence } from "framer-motion"; // Importez Framer Motion
import { FaEdit, FaTrash } from "react-icons/fa"; 
const GestionStructure = () => {
  // États pour les données
  const [categories, setCategories] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);

  // États pour l'affichage des éléments
  const [openCategories, setOpenCategories] = useState({});
  const [openNiveaux, setOpenNiveaux] = useState({});
  const [openFilieres, setOpenFilieres] = useState({});

  // États pour la gestion des modales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les modales de modification
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState(null);
  const [entityType, setEntityType] = useState("");

  const navigate = useNavigate();

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [categoriesRes, levelsRes, filieresRes, matieresRes] = await Promise.all([
          fetch("http://localhost:5000/api/categories", { headers }).then((res) => res.json()),
          fetch("http://localhost:5000/api/levels", { headers }).then((res) => res.json()),
          fetch("http://localhost:5000/api/filieres", { headers }).then((res) => res.json()),
          fetch("http://localhost:5000/api/subjects", { headers }).then((res) => res.json()),
        ]);

        setCategories(categoriesRes);
        setNiveaux(levelsRes);
        setFilieres(filieresRes);
        setMatieres(matieresRes);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gérer la suppression
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
        const fetchData = async () => {
          const [categoriesRes, levelsRes, filieresRes, matieresRes] = await Promise.all([
            fetch("http://localhost:5000/api/categories", { headers }).then((res) => res.json()),
            fetch("http://localhost:5000/api/levels", { headers }).then((res) => res.json()),
            fetch("http://localhost:5000/api/filieres", { headers }).then((res) => res.json()),
            fetch("http://localhost:5000/api/subjects", { headers }).then((res) => res.json()),
          ]);

          setCategories(categoriesRes);
          setNiveaux(levelsRes);
          setFilieres(filieresRes);
          setMatieres(matieresRes);
        };

        await fetchData();

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
  
      let endpoint = "";
      let body;
      let headers = { Authorization: `Bearer ${token}` };
  
      switch (entityType) {
        case "category":
          endpoint = "categories";
          // Do NOT set Content-Type for FormData; the browser will handle it
          body = formData; // FormData is already prepared in EditModal
          break;
        case "level":
          endpoint = "levels";
          headers["Content-Type"] = "application/json"; // Use JSON for levels
          body = JSON.stringify({ nom: formData.get("nom") }); // Extract name from FormData
          break;
        case "filière":
          endpoint = "filieres";
          headers["Content-Type"] = "application/json"; // Use JSON for filières
          body = JSON.stringify({ nom: formData.get("nom") }); // Extract name from FormData
          break;
        case "subject":
          endpoint = "subjects";
          headers["Content-Type"] = "application/json"; // Use JSON for subjects
          body = JSON.stringify({ nom: formData.get("nom") }); // Extract name from FormData
          break;
        default:
          throw new Error("Type d'entité non reconnu");
      }
  
      const response = await fetch(`http://localhost:5000/api/${endpoint}/${entityToEdit._id}`, {
        method: "PUT",
        headers,
        body,
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }
  
      // Refresh data after modification
      const fetchData = async () => {
        const [categoriesRes, levelsRes, filieresRes, matieresRes] = await Promise.all([
          fetch("http://localhost:5000/api/categories", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
          fetch("http://localhost:5000/api/levels", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
          fetch("http://localhost:5000/api/filieres", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
          fetch("http://localhost:5000/api/subjects", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
        ]);
  
        setCategories(categoriesRes);
        setNiveaux(levelsRes);
        setFilieres(filieresRes);
        setMatieres(matieresRes);
      };
  
      await fetchData();
  
      // Show success message
      Swal.fire({
        title: "Modifié !",
        text: `"${formData.get("nom")}" a été modifié avec succès.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
  
      closeEditModal();
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la modification.",
        icon: "error",
      });
    }
  };

  // Basculer l'affichage des catégories
  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Basculer l'affichage des niveaux
  const toggleNiveau = (niveauId) => {
    setOpenNiveaux((prev) => ({
      ...prev,
      [niveauId]: !prev[niveauId],
    }));
  };

  // Basculer l'affichage des filières
  const toggleFiliere = (filiereId) => {
    setOpenFilieres((prev) => ({
      ...prev,
      [filiereId]: !prev[filiereId],
    }));
  };

  // Rediriger vers la page des cours
  const goToCourses = (matiereId) => {
    navigate(`/admin/GestionCoursById/${matiereId}`);
  };

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100  font-arabic font-bold" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg lg:p-6 p-2">
        <h1 className="text-2xl md:text-4xl font-baloo text-blue-700 border-b pb-3 mb-4 text-right">
          إدارة الهيكلة
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">جاري التحميل...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-center">لا توجد فئات متاحة</p>
        ) : (
          <ul className="space-y-4">
            {categories.map((category) => (
              <motion.li
                key={category._id}
                className="border border-gray-300 p-4 rounded-lg shadow-sm hover:border-blue-300 hover:border-x-4"
              >
                <div
                  className="flex justify-between items-center cursor-pointer "
                  onClick={() => toggleCategory(category._id)}
                >
                  <span className="text-lg font-semibold text-gray-900">{category.nom}</span>
                 
                    <div className="flex gap-2">
                      {/* Icône "Modifier" avec animation */}
                      <FaEdit
                        className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                        title="تعديل"
                        onClick={(e) => {
                          e.stopPropagation(); // Empêcher la propagation de l'événement
                          openEditModal(category, "category");
                        }}
                      />

                      {/* Icône "Supprimer" avec animation */}
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                        title="حذف"
                        onClick={(e) => {
                          e.stopPropagation(); // Empêcher la propagation de l'événement
                          handleDelete(category._id, "categories", category.nom);
                        }}
                      />
                      
                    </div>
                    
                </div>

                <AnimatePresence>
                  {openCategories[category._id] && (
                    <motion.ul
                      className="mt-2 border border-gray-200 p-3 rounded-lg space-y-2"
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {niveaux
                        .filter((niveau) => niveau.category === category._id)
                        .map((niveau) => (
                          <motion.li
                            key={niveau._id}
                            className="border border-gray-200 p-2 rounded-md  hover:border-green-300 hover:border-x-4"
                          >
                            <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleNiveau(niveau._id)}
                            >
                              <span className="text-md font-semibold text-gray-800">{niveau.nom}</span>
                            
                              <div className="flex gap-2">
                                {/* Icône "Modifier" avec animation */}
                                <FaEdit
                                  className="text-blue-400 cursor-pointer hover:scale-110 hover:rotate-12 transition-transform"
                                  title="تعديل"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                    openEditModal(niveau, "level");
                                  }}
                                />

                                {/* Icône "Supprimer" avec animation */}
                                <FaTrash
                                  className="text-red-400 cursor-pointer hover:scale-110 hover:rotate-12 transition-transform"
                                  title="حذف"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                    handleDelete(niveau._id, "levels", niveau.nom);
                                  }}
                                />
                              </div>
                            </div>

                            <AnimatePresence>
                              {openNiveaux[niveau._id] && (
                                <motion.div
                                  variants={listVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                >
                                  {filieres.some((filiere) => filiere.level === niveau._id) ? (
                                    <motion.ul
                                      className="border border-gray-200 p-3 rounded-lg space-y-2"
                                      variants={listVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="exit"
                                    >
                                      {filieres
                                        .filter((filiere) => filiere.level === niveau._id)
                                        .map((filiere) => (
                                          <motion.li
                                            key={filiere._id}
                                            className="border border-gray-300 p-2 rounded-md  hover:border-blue-200 hover:border-x-4"
                                          >
                                            <div
                                              className="flex justify-between items-center cursor-pointer"
                                              onClick={() => toggleFiliere(filiere._id)}
                                            >
                                              <span className="text-md font-semibold text-gray-900">{filiere.nom}</span>
                                              
                                              <div className="flex gap-2">
                                                {/* Icône "Modifier" avec animation */}
                                                <FaEdit
                                                  className="text-blue-500 cursor-pointer hover:scale-110 hover:rotate-12 transition-transform"
                                                  title=""
                                                  onClick={(e) => {
                                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                                    openEditModal(filiere, "filière");
                                                  }}
                                                />

                                                {/* Icône "Supprimer" avec animation */}
                                                <FaTrash
                                                  className="text-red-500 cursor-pointer hover:scale-110 hover:rotate-12 transition-transform"
                                                  title="حذف"
                                                  onClick={(e) => {
                                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                                    handleDelete(filiere._id, "filieres", filiere.nom);
                                                  }}
                                                />
                                              </div>
                                            </div>

                                            <AnimatePresence>
                                              {openFilieres[filiere._id] && (
                                                <motion.ul
                                                  className="mt-2 border border-gray-300 p-3 rounded-lg space-y-2"
                                                  variants={listVariants}
                                                  initial="hidden"
                                                  animate="visible"
                                                  exit="exit"
                                                >
                                                  {matieres
                                                    .filter((matiere) => matiere.filiere === filiere._id)
                                                    .map((matiere) => (
                                                      <motion.li
                                                        key={matiere._id}
                                                        className="border border-gray-400 p-2 rounded-md flex justify-between items-center  hover:bg-green-100"
                                                        onClick={() => goToCourses(matiere._id)}
                                                      >
                                                        <span className="text-md font-semibold text-gray-600">{matiere.nom}</span>
                                                                                                              
                                                      <div className="flex gap-2">
                                                        {/* Icône "Modifier" avec animation */}
                                                        <FaEdit
                                                          className="text-blue-600 cursor-pointer hover:scale-110 hover:rotate-12 transition-transform"
                                                          title="تعديل"
                                                          onClick={(e) => {
                                                            e.stopPropagation(); // Empêcher la propagation de l'événement
                                                            openEditModal(matiere, "subject");
                                                          }}
                                                        />

                                                        {/* Icône "Supprimer" avec animation */}
                                                        <FaTrash
                                                          className="text-red-600 cursor-pointer hover:scale-110 hover:rotate-12 transition-transform"
                                                          title="حذف"
                                                          onClick={(e) => {
                                                            e.stopPropagation(); // Empêcher la propagation de l'événement
                                                            handleDelete(matiere._id, "subjects", matiere.nom);
                                                          }}
                                                        />
                                                      </div>
                                                         </motion.li>
                                                    ))}
                                                </motion.ul>
                                              )}
                                            </AnimatePresence>
                                          </motion.li>
                                        ))}
                                    </motion.ul>
                                  ) : (
                                    <motion.ul
                                      className="mt-2 border border-gray-300 p-3 rounded-lg space-y-2"
                                      variants={listVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="exit"
                                    >
                                      {matieres
                                        .filter((matiere) => matiere.level === niveau._id)
                                        .map((matiere) => (
                                          <motion.li
                                            key={matiere._id}
                                            className="border border-gray-400 p-2 rounded-md flex justify-between items-center  hover:bg-blue-200"
                                            onClick={() => goToCourses(matiere._id)}
                                          >
                                            <span className="text-md font-semibold text-gray-600">{matiere.nom}</span>
                                             <div className="flex gap-2">                                     
                                              <div className="flex gap-2">
                                                {/* Icône "Modifier" */}
                                                <FaEdit
                                                  className="text-blue-600 cursor-pointer"
                                                  title="تعديل"
                                                  onClick={(e) => {
                                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                                    openEditModal(matiere, "subject");
                                                  }}
                                                />

                                                {/* Icône "Supprimer" */}
                                                <FaTrash
                                                  className="text-red-600 cursor-pointer"
                                                  title="حذف"
                                                  onClick={(e) => {
                                                    e.stopPropagation(); // Empêcher la propagation de l'événement
                                                    handleDelete(matiere._id, "subjects", matiere.nom);
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </motion.li>
                                        ))}
                                    </motion.ul>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.li>
                        ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        )}

        {/* Modale de modification */}
        <EditModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          entity={entityToEdit}
          onSave={handleSave}
          type={entityType}
        />
      </div>
    </div>
  );
};

export default GestionStructure;