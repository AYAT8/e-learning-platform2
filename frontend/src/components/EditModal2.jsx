import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EditModal2 = ({ isOpen, onClose, entity, onSave, type }) => {
  // Initialisation des données du formulaire
  const [formData, setFormData] = useState({
    title: "",
    nom: "",
    description: "",
    url: "",
  });

  // Mettre à jour les valeurs initiales lorsque l'entité change
  useEffect(() => {
    if (entity) {
      setFormData({
        title: entity.title || "",
        nom: entity.nom || "",
        description: entity.description || "",
        url: entity.url || "",
      });
    }
  }, [entity]);

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSave(formData);
      Swal.fire({
        title: "Modifié !",
        text: `"${formData.title || formData.nom}" a été modifié avec succès.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la modification.",
        icon: "error",
      });
    }
  };

  // Si la modale n'est pas ouverte, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Modifier {type}</h2>
        <form onSubmit={handleSubmit}>
          {/* Champ pour le titre (uniquement pour les cours et ressources) */}
          {(type === "course" || type === "ressource") && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required={type === "course" || type === "ressource"}
              />
            </div>
          )}

          {/* Champ pour le nom (uniquement pour les types de ressources) */}
          {type === "typeRessource" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          )}

          {/* Champ pour la description (uniquement pour les cours) */}
          {type === "course" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          )}

          {/* Champ pour l'URL (uniquement pour les ressources) */}
          {type === "ressource" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Fichier</label>
              <input
                type="file"
                name="url"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                accept="*/*"
              />
            </div>
          )}

          {/* Boutons Annuler et Enregistrer */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal2;