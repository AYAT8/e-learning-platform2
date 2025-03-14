import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importer SweetAlert2

const CategoryForm = () => {
    const [nom, setNom] = useState("");
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);

    // Charger les catégories existantes
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories :", error);
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Erreur lors du chargement des catégories.",
                });
            }
        };

        fetchCategories();
    }, []);

    // Fonction pour gérer l'ajout d'une catégorie
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nom.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Champ vide",
                text: "Veuillez entrer un nom pour la catégorie.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("nom", nom);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch("http://localhost:5000/api/categories/add-category", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                // Afficher une alerte de succès
                Swal.fire({
                    icon: "success",
                    title: "Succès !",
                    text: "Catégorie ajoutée avec succès !",
                    timer: 2000, // Fermer automatiquement après 2 secondes
                    showConfirmButton: false,
                });

                // Mettre à jour la liste des catégories
                setCategories([...categories, data.category]);
                setNom("");
                setImage(null);
            } else {
                // Afficher une alerte d'erreur
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: data.error || "Une erreur s'est produite lors de l'ajout de la catégorie.",
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la catégorie :", error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Erreur lors de l'ajout de la catégorie.",
            });
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-700">Ajouter une Catégorie</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Nom de la catégorie"
                    className="w-full p-2 border rounded-lg"
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full p-2 border rounded-lg"
                />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Ajouter
                </button>
            </form>
        </div>
    );
};

export default CategoryForm;