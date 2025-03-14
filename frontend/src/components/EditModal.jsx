import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EditModal = ({ isOpen, onClose, entity, onSave, type }) => {
  // Determine if the entity is a category
  const isCategory = type === "category";

  // Initialize form data
  const [formData, setFormData] = useState({
    nom: "",
    image: null,
  });

  // Update form data when the entity changes
  useEffect(() => {
    if (entity) {
      setFormData({
        nom: entity.nom || "",
        image: isCategory ? entity.image : null,
      });
    }
  }, [entity, isCategory]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);

      // Append the image file if it exists (only for categories)
      if (isCategory && formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      await onSave(formDataToSend); // Pass FormData or JSON to onSave
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

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Modifier {type}</h2>
        <form onSubmit={handleSubmit}>
          {/* Field for name */}
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

          {/* Field for image (only for categories) */}
          {isCategory && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                accept="image/*"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={
                      formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : `http://localhost:5000/${formData.image.replace(/\\/g, "/")}`
                    }
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Cancel and Save buttons */}
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

export default EditModal;