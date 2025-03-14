import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const LevelForm = ({ onLevelAdded = () => {} }) => {
    const [nom, setNom] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);

    // Charger les catégories depuis l'API
    useEffect(() => {
        fetch("http://localhost:5000/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => {
                console.error("Erreur lors du chargement des catégories:", err);
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Erreur lors du chargement des catégories.",
                });
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que les champs sont remplis
        if (!nom.trim() || !category) {
            Swal.fire({
                icon: "warning",
                title: "Champs manquants",
                text: "Veuillez remplir tous les champs.",
            });
            return;
        }

        const newLevel = { nom, category };

        try {
            const response = await fetch("http://localhost:5000/api/levels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newLevel),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Lire la réponse d'erreur
                console.error("Erreur du serveur :", errorData);
                throw new Error(errorData.error || "Erreur lors de l'ajout du niveau");
            }

            const data = await response.json();

            // Afficher une alerte de succès
            Swal.fire({
                icon: "success",
                title: "Succès !",
                text: "Niveau ajouté avec succès !",
                timer: 2000, // Fermer automatiquement après 2 secondes
                showConfirmButton: false,
            });

            // Appeler la fonction onLevelAdded pour mettre à jour la liste des niveaux
            onLevelAdded(data.level);
            setNom("");
            setCategory("");
        } catch (error) {
            console.error("Erreur :", error.message);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.message || "Une erreur s'est produite lors de l'ajout du niveau.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Ajouter un Niveau</h2>
            
            {/* Sélection de la catégorie */}
            <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full p-2 border rounded-lg" 
                required
            >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.nom}
                    </option>
                ))}
            </select>

            {/* Saisie du nom du niveau */}
            <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom du niveau"
                className="w-full p-2 border rounded-lg"
                required
            />

            {/* Bouton d'ajout */}
            <button 
                type="submit" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
                Ajouter
            </button>
        </form>
    );
};

export default LevelForm;