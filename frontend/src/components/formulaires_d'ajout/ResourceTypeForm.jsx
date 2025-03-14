import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importer SweetAlert2

const TypeRessourceForm = () => {
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [filiere, setFiliere] = useState(""); // Facultatif
    const [subject, setSubject] = useState("");
    const [course, setCourse] = useState("");
    const [typeName, setTypeName] = useState(""); // Nom du type de ressource

    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    
    const [hasFilieres, setHasFilieres] = useState(false); // Vérifie si le niveau a des filières

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
            setLevel("");
            setFilieres([]);
            setFiliere("");
            setSubjects([]);
            setSubject("");
            setCourses([]);
            setCourse("");
        }
    }, [category]);

    // Charger les filières en fonction du niveau
    useEffect(() => {
        if (level) {
            fetch(`http://localhost:5000/api/filieres/${level}`)
                .then((res) => res.json())
                .then((data) => {
                    setFilieres(data);
                    setHasFilieres(data.length > 0); // Vérifie s'il y a des filières
                    setFiliere(""); // Réinitialisation
                })
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
            setFiliere("");
            setHasFilieres(false);
            setSubjects([]);
            setSubject("");
            setCourses([]);
            setCourse("");
        }
    }, [level]);

    // Charger les matières en fonction du niveau ou de la filière
    useEffect(() => {
        if (filiere) {
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
            setSubject("");
            setCourses([]);
            setCourse("");
        }
    }, [level, filiere]);

    // Charger les cours en fonction de la matière
    useEffect(() => {
        if (subject) {
            fetch(`http://localhost:5000/api/courses/subject/${subject}`)
                .then((res) => res.json())
                .then((data) => setCourses(data))
                .catch((err) => {
                    console.error("Erreur de chargement des cours", err);
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Erreur lors du chargement des cours.",
                    });
                });
        } else {
            setCourses([]);
            setCourse("");
        }
    }, [subject]);

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que les champs obligatoires sont remplis
        if (!category || !level || !subject || !course || !typeName) {
            Swal.fire({
                icon: "warning",
                title: "Champs manquants",
                text: "Tous les champs obligatoires doivent être remplis.",
            });
            return;
        }

        const resourceData = {
            nom: typeName,
            category,
            level,
            filiere: hasFilieres && filiere ? filiere : null, // Envoie null si pas de filière
            subject,
            cours: course,
        };

        try {
            const res = await fetch("http://localhost:5000/api/typeressources", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resourceData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erreur lors de l'ajout du type de ressource.");
            }

            const data = await res.json();

            // Afficher une alerte de succès
            Swal.fire({
                icon: "success",
                title: "Succès !",
                text: "Type de ressource ajouté avec succès !",
                timer: 2000, // Fermer automatiquement après 2 secondes
                showConfirmButton: false,
            });

            // Réinitialiser le formulaire après l'ajout
            setCategory("");
            setLevel("");
            setFiliere("");
            setSubject("");
            setCourse("");
            setTypeName("");
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.message || "Une erreur est survenue lors de l'ajout du type de ressource.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Ajouter un Type de Ressource</h2>

            {/* Champ pour le nom du type de ressource */}
            <input
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="Nom du type de ressource"
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
                {levels.map((lvl) => (
                    <option key={lvl._id} value={lvl._id}>{lvl.nom}</option>
                ))}
            </select>

            {/* Sélection de la filière (uniquement si disponible) */}
            {hasFilieres && (
                <select
                    value={filiere}
                    onChange={(e) => setFiliere(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    disabled={!level}
                >
                    <option value="">Sélectionner une filière (optionnel)</option>
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

            {/* Sélection du cours */}
            <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
                disabled={!subject}
            >
                <option value="">Sélectionner un cours</option>
                {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                ))}
            </select>

            {/* Bouton d'ajout */}
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                Ajouter
            </button>
        </form>
    );
};

export default TypeRessourceForm;