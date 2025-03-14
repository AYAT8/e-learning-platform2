import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importer SweetAlert2

const SubjectForm = ({ onSubmit = () => {} }) => {
    const [nom, setNom] = useState("");
    const [level, setLevel] = useState("");
    const [category, setCategory] = useState("");
    const [filiere, setFiliere] = useState("");
    const [levels, setLevels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filieres, setFilieres] = useState([]);

    // Charger les catégories
    useEffect(() => {
        fetch("http://localhost:5000/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => {
                console.error("Erreur de chargement des catégories", err);
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Erreur lors du chargement des catégories.",
                });
            });
    }, []);

    // Charger les niveaux en fonction de la catégorie
    useEffect(() => {
        if (category) {
            fetch(`http://localhost:5000/api/levels/${category}`)
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
        } else {
            setLevels([]);
            setFilieres([]);
        }
    }, [category]);

    // Charger les filières en fonction du niveau sélectionné
    useEffect(() => {
        if (level) {
            fetch(`http://localhost:5000/api/filieres/${level}`)
                .then((res) => res.json())
                .then((data) => setFilieres(data))
                .catch((err) => {
                    console.error("Erreur de chargement des filières", err);
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Erreur lors du chargement des filières.",
                    });
                });
        } else {
            setFilieres([]);
        }
    }, [level]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que les champs obligatoires sont remplis
        if (nom.trim() === "" || !level || !category) {
            Swal.fire({
                icon: "warning",
                title: "Champs manquants",
                text: "Veuillez remplir tous les champs obligatoires.",
            });
            return;
        }

        const newSubject = { nom, level, category, filiere: filiere || null };

        try {
            const response = await fetch("http://localhost:5000/api/subjects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSubject),
            });

            const result = await response.json();

            if (response.ok) {
                // Afficher une alerte de succès
                Swal.fire({
                    icon: "success",
                    title: "Succès !",
                    text: "Matière ajoutée avec succès !",
                    timer: 2000, // Fermer automatiquement après 2 secondes
                    showConfirmButton: false,
                });

                // Appeler la fonction onSubmit pour mettre à jour la liste des matières
                onSubmit(result.subject);
                setNom("");
                setLevel("");
                setCategory("");
                setFiliere("");
            } else {
                // Afficher une alerte d'erreur
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: result.message || "Une erreur s'est produite lors de l'ajout de la matière.",
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
            <h2 className="text-xl font-bold text-gray-700">Ajouter une Matière</h2>

            {/* Champ pour le nom de la matière */}
            <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom de la matière"
                className="w-full p-2 border rounded-lg"
                required
            />

            {/* Sélection de la catégorie */}
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
            >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.nom}</option>
                ))}
            </select>

            {/* Sélection du niveau */}
            <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
                disabled={!category}
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

            {/* Sélection de la filière (optionnelle) */}
            <select
                value={filiere}
                onChange={(e) => setFiliere(e.target.value)}
                className="w-full p-2 border rounded-lg"
                disabled={!level}
            >
                <option value="">Sélectionner une filière (optionnel)</option>
                {filieres.length > 0 ? (
                    filieres.map((fil) => (
                        <option key={fil._id} value={fil._id}>{fil.nom}</option>
                    ))
                ) : (
                    <option value="" disabled>Aucune filière disponible</option>
                )}
            </select>

            {/* Bouton d'ajout */}
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                Ajouter
            </button>
        </form>
    );
};

export default SubjectForm;