// components/EditCategoryModal.js
import { useState } from "react";
import Swal from "sweetalert2";

const EditCategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    nom: category ? category.nom : "",
    image: category ? category.image : null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSave(formData);
      Swal.fire({
        title: "Modifié !",
        text: `"${formData.nom}" a été modifié avec succès.`,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Modifier la catégorie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={formData.nom || ""}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg"
              accept="image/*"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image instanceof File ? URL.createObjectURL(formData.image) : `http://localhost:5000/${formData.image}`}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
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

export default EditCategoryModal;