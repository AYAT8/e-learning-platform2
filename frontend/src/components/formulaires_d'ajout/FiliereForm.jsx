import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importer SweetAlert2

const FiliereForm = ({ onSubmit = () => {} }) => {
    const [nom, setNom] = useState("");
    const [level, setLevel] = useState("");
    const [levels, setLevels] = useState([]);
    const lyceeCategoryId = "67b0b07d5ecd650d2c369c7f"; // ID fixe de la catégorie "Lycée"

    // Charger les niveaux correspondant à la catégorie "Lycée"
    useEffect(() => {
        fetch(`http://localhost:5000/api/levels/${lyceeCategoryId}`)
            .then((res) => res.json())
            .then((data) => setLevels(data))
            .catch((err) => {
                console.error("Erreur de chargement des niveaux", err);
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Erreur lors du chargement des niveaux.",
                });
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que les champs sont remplis
        if (nom.trim() === "" || !level) {
            Swal.fire({
                icon: "warning",
                title: "Champs manquants",
                text: "Veuillez remplir tous les champs.",
            });
            return;
        }

        const newFiliere = { nom, level, category: lyceeCategoryId };

        try {
            const response = await fetch("http://localhost:5000/api/filieres", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFiliere),
            });

            const result = await response.json();

            if (response.ok) {
                // Afficher une alerte de succès
                Swal.fire({
                    icon: "success",
                    title: "Succès !",
                    text: "Filière ajoutée avec succès !",
                    timer: 2000, // Fermer automatiquement après 2 secondes
                    showConfirmButton: false,
                });

                // Appeler la fonction onSubmit pour mettre à jour la liste des filières
                onSubmit(result.filiere);
                setNom("");
                setLevel("");
            } else {
                // Afficher une alerte d'erreur
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: result.message || "Une erreur s'est produite lors de l'ajout de la filière.",
                });
            }
        } catch (error) {
            console.error("Erreur de connexion avec l'API:", error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Erreur de connexion avec l'API.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Ajouter une Filière</h2>

            {/* Champ pour le nom de la filière */}
            <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom de la filière"
                className="w-full p-2 border rounded-lg"
                required
            />

            {/* Affichage de la catégorie fixe "Lycée" */}
            <div className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed">
                Lycée (Catégorie Fixe)
            </div>

            {/* Sélection du niveau */}
            <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
            >
                <option value="">Sélectionner un niveau</option>
                {levels.length > 0 ? (
                    levels.map((lvl) => (
                        <option key={lvl._id} value={lvl._id}>{lvl.nom}</option>
                    ))
                ) : (
                    <option value="" disabled>Aucun niveau disponible</option>
                )}
            </select>

            {/* Bouton d'ajout */}
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                Ajouter
            </button>
        </form>
    );
};

export default FiliereForm;