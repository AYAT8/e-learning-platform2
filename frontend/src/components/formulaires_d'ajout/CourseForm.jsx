import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importer SweetAlert2

const CourseForm = () => {
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [filiere, setFiliere] = useState("");
    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [subjects, setSubjects] = useState([]);

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
        }
    }, [category]);

    // Charger les filières en fonction du niveau
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

    // Charger les matières en fonction du niveau ou de la filière
    useEffect(() => {
        if (category === "67b0b07d5ecd650d2c369c7f" && filiere) {
            fetch(`http://localhost:5000/api/subjects/filiere/${filiere}`)
                .then((res) => res.json())
                .then((data) => setSubjects(data))
                .catch((err) => {
                    console.error("Erreur de chargement des matières", err);
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Erreur lors du chargement des matières.",
                    });
                });
        } else if (level) {
            fetch(`http://localhost:5000/api/subjects/level/${level}`)
                .then((res) => res.json())
                .then((data) => setSubjects(data))
                .catch((err) => {
                    console.error("Erreur de chargement des matières", err);
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Erreur lors du chargement des matières.",
                    });
                });
        } else {
            setSubjects([]);
        }
    }, [category, level, filiere]);

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que les champs obligatoires sont remplis
        if (!title || !description || !subject || !category || !level) {
            Swal.fire({
                icon: "warning",
                title: "Champs manquants",
                text: "Tous les champs obligatoires doivent être remplis.",
            });
            return;
        }

        const courseData = {
            title,
            description,
            subject,
            category,
            level,
            filiere: filiere || null, // Assurer que filiere est null si non applicable
        };

        try {
            const response = await fetch("http://localhost:5000/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(courseData),
            });

            const data = await response.json();

            if (response.ok) {
                // Afficher une alerte de succès
                Swal.fire({
                    icon: "success",
                    title: "Succès !",
                    text: "Cours ajouté avec succès !",
                    timer: 2000, // Fermer automatiquement après 2 secondes
                    showConfirmButton: false,
                });

                // Réinitialisation du formulaire
                setTitle("");
                setDescription("");
                setCategory("");
                setLevel("");
                setFiliere("");
                setSubject("");
            } else {
                // Afficher une alerte d'erreur
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: data.message || "Une erreur s'est produite lors de l'ajout du cours.",
                });
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du cours", error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Erreur de connexion avec l'API.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Ajouter un Cours</h2>

            {/* Champ pour le titre du cours */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nom du cours"
                className="w-full p-2 border rounded-lg"
                required
            />

            {/* Champ pour la description du cours */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du cours"
                className="w-full p-2 border rounded-lg"
                required
            ></textarea>

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
                {levels.map((lvl) => (
                    <option key={lvl._id} value={lvl._id}>{lvl.nom}</option>
                ))}
            </select>

            {/* Sélection de la filière (uniquement pour la catégorie "Lycée") */}
            {category === "67b0b07d5ecd650d2c369c7f" && (
                <select
                    value={filiere}
                    onChange={(e) => setFiliere(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((fil) => (
                        <option key={fil._id} value={fil._id}>{fil.nom}</option>
                    ))}
                </select>
            )}

            {/* Sélection de la matière */}
            <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
                disabled={!level}
            >
                <option value="">Sélectionner une matière</option>
                {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.nom}</option>
                ))}
            </select>

            {/* Bouton d'ajout */}
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                Ajouter le cours
            </button>
        </form>
    );
};

export default CourseForm;