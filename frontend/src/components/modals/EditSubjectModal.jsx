// components/EditSubjectModal.js
import { useState } from "react";
import Swal from "sweetalert2";

const EditSubjectModal = ({ isOpen, onClose, subject, onSave }) => {
  const [formData, setFormData] = useState({
    nom: subject ? subject.nom : "",
  });

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
        <h2 className="text-xl font-bold mb-4">Modifier la matière</h2>
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

export default EditSubjectModal;