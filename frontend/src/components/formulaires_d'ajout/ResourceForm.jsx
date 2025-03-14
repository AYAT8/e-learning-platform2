import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importer SweetAlert2

const RessourceForm = () => {
    // États pour les champs du formulaire
    const [title, setTitle] = useState("");
    const [id_category, setIdCategory] = useState("");
    const [id_level, setIdLevel] = useState("");
    const [id_filier, setIdFilier] = useState("");
    const [id_subject, setIdSubject] = useState("");
    const [id_course, setIdCourse] = useState("");
    const [id_type_ressource, setIdTypeRessource] = useState("");
    const [url, setUrl] = useState(null);
    const [image_url, setImageUrl] = useState(null);

    // États pour les options des listes déroulantes
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [typesRessources, setTypesRessources] = useState([]);
    const [hasFilieres, setHasFilieres] = useState(false);

    // État pour le loader
    const [isLoading, setIsLoading] = useState(false);

    // Charger les catégories au montage du composant
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

    // Charger les niveaux lorsque la catégorie est sélectionnée
    useEffect(() => {
        if (id_category) {
            fetch(`http://localhost:5000/api/levels/${id_category}`)
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
            resetFilters(["id_level", "id_filier", "id_subject", "id_course", "id_type_ressource"]);
        }
    }, [id_category]);

    // Charger les filières lorsque le niveau est sélectionné
    useEffect(() => {
        if (id_level) {
            fetch(`http://localhost:5000/api/filieres/${id_level}`)
                .then((res) => res.json())
                .then((data) => {
                    setFilieres(data);
                    setHasFilieres(data.length > 0);
                    setIdFilier("");
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
            resetFilters(["id_filier", "id_subject", "id_course", "id_type_ressource"]);
        }
    }, [id_level]);

    // Charger les matières lorsque la filière ou le niveau est sélectionné
    useEffect(() => {
        if (id_filier) {
            fetch(`http://localhost:5000/api/subjects/filiere/${id_filier}`)
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
        } else if (id_level) {
            fetch(`http://localhost:5000/api/subjects/level/${id_level}`)
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
            resetFilters(["id_subject", "id_course", "id_type_ressource"]);
        }
    }, [id_level, id_filier]);

    // Charger les cours lorsque la matière est sélectionnée
    useEffect(() => {
        if (id_subject) {
            fetch(`http://localhost:5000/api/courses/subject/${id_subject}`)
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
            resetFilters(["id_course", "id_type_ressource"]);
        }
    }, [id_subject]);

    // Charger les types de ressources lorsque le cours est sélectionné
    useEffect(() => {
        if (id_course) {
            fetch(`http://localhost:5000/api/typeressources/cours/${id_course}`)
                .then((res) => res.json())
                .then((data) => setTypesRessources(data))
                .catch((err) => {
                    console.error("Erreur de chargement des types de ressources", err);
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Erreur lors du chargement des types de ressources.",
                    });
                });
        } else {
            setTypesRessources([]);
            setIdTypeRessource("");
        }
    }, [id_course]);

    // Réinitialiser les filtres
    const resetFilters = (filters) => {
        if (filters.includes("id_level")) setIdLevel("");
        if (filters.includes("id_filier")) setIdFilier("");
        if (filters.includes("id_subject")) setIdSubject("");
        if (filters.includes("id_course")) setIdCourse("");
        if (filters.includes("id_type_ressource")) setIdTypeRessource("");
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation des champs obligatoires
        if (!title || !id_category || !id_level || !id_subject || !id_course || !id_type_ressource || !url) {
            Swal.fire({
                icon: "warning",
                title: "Champs manquants",
                text: "Tous les champs obligatoires doivent être remplis.",
            });
            return;
        }

        // Créer un objet FormData pour envoyer les fichiers
        const formData = new FormData();
        formData.append("title", title);
        formData.append("id_category", id_category);
        formData.append("id_level", id_level);
        formData.append("id_filier", hasFilieres && id_filier ? id_filier : "");
        formData.append("id_subject", id_subject);
        formData.append("id_course", id_course);
        formData.append("id_type_ressource", id_type_ressource);
        formData.append("fichier", url); // Utilisez "fichier" pour correspondre à la route
        if (image_url) {
            formData.append("image_url", image_url);
        }

        setIsLoading(true); // Activer le loader

        try {
            const res = await fetch("http://localhost:5000/api/ressources/ajouter", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erreur lors de l'ajout de la ressource.");
            }

            // Afficher une alerte de succès
            Swal.fire({
                icon: "success",
                title: "Succès !",
                text: "Ressource ajoutée avec succès !",
                timer: 2000, // Fermer automatiquement après 2 secondes
                showConfirmButton: false,
            });

            // Réinitialiser le formulaire
            resetFilters(["title", "id_category", "id_level", "id_filier", "id_subject", "id_course", "id_type_ressource"]);
            setTitle("");
            setUrl(null);
            setImageUrl(null);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.message || "Une erreur est survenue lors de l'ajout de la ressource.",
            });
        } finally {
            setIsLoading(false); // Désactiver le loader
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Ajouter une ressource</h2>

            {/* Champ Titre */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la ressource"
                className="w-full p-2 border rounded-lg"
                required
            />

            {/* Sélection de la catégorie */}
            <select value={id_category} onChange={(e) => setIdCategory(e.target.value)} className="w-full p-2 border rounded-lg" required>
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.nom}
                    </option>
                ))}
            </select>

            {/* Sélection du niveau */}
            <select value={id_level} onChange={(e) => setIdLevel(e.target.value)} className="w-full p-2 border rounded-lg" required disabled={!id_category}>
                <option value="">Sélectionner un niveau</option>
                {levels.map((lvl) => (
                    <option key={lvl._id} value={lvl._id}>
                        {lvl.nom}
                    </option>
                ))}
            </select>

            {/* Sélection de la filière (optionnelle) */}
            {hasFilieres && (
                <select value={id_filier} onChange={(e) => setIdFilier(e.target.value)} className="w-full p-2 border rounded-lg">
                    <option value="">Sélectionner une filière (optionnel)</option>
                    {filieres.map((fil) => (
                        <option key={fil._id} value={fil._id}>
                            {fil.nom}
                        </option>
                    ))}
                </select>
            )}

            {/* Sélection de la matière */}
            <select value={id_subject} onChange={(e) => setIdSubject(e.target.value)} className="w-full p-2 border rounded-lg" required>
                <option value="">Sélectionner une matière</option>
                {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                        {sub.nom}
                    </option>
                ))}
            </select>

            {/* Sélection du cours */}
            <select value={id_course} onChange={(e) => setIdCourse(e.target.value)} className="w-full p-2 border rounded-lg" required>
                <option value="">Sélectionner un cours</option>
                {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.title}
                    </option>
                ))}
            </select>

            {/* Sélection du type de ressource */}
            <select value={id_type_ressource} onChange={(e) => setIdTypeRessource(e.target.value)} className="w-full p-2 border rounded-lg" required>
                <option value="">Sélectionner un type de ressource</option>
                {typesRessources.map((type) => (
                    <option key={type._id} value={type._id}>
                        {type.nom}
                    </option>
                ))}
            </select>
            <div className="space-y-4">
    {/* Champ pour le fichier principal */}
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Fichier principal (obligatoire)
        </label>
        <input
            type="file"
            onChange={(e) => setUrl(e.target.files[0])}
            className="w-full p-2 border rounded-lg"
            required
        />
    </div>

    {/* Champ pour l'image (optionnelle) */}
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Image (optionnelle)
        </label>
        <input
            type="file"
            onChange={(e) => setImageUrl(e.target.files[0])}
            className="w-full p-2 border rounded-lg"
        />
    </div>
</div>

            {/* Bouton de soumission avec loader */}
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    "Ajouter"
                )}
            </button>
        </form>
    );
};

export default RessourceForm;