const express = require("express");
const router = express.Router();
const Level = require("../models/Level");
const Filiere = require("../models/Filiere");
const Subject = require("../models/Subject");
const Course = require("../models/Course");
const TypeRessource = require("../models/TypeRessource");
const Ressource = require("../models/Ressource");
const { loginAdmin } = require("../controllers/adminController");
const { getAllAdmins } = require("../controllers/adminController");

// ✅ Route pour récupérer les statistiques de l'admin dashboard
router.get("/stats", async (req, res) => {
    try {
        const totalRessources = await Ressource.countDocuments();

        const totalTelechargements = await Ressource.aggregate([
            { $group: { _id: null, total: { $sum: "$downloads" } } }
        ]);

        const totalVues = await Ressource.aggregate([
            { $group: { _id: null, total: { $sum: "$views" } } }
        ]);

        res.json({
            totalRessources,
            totalTelechargements: totalTelechargements.length > 0 ? totalTelechargements[0].total : 0,
            totalVues: totalVues.length > 0 ? totalVues[0].total : 0,
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des statistiques :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
});
router.post("/login", loginAdmin);

module.exports = router;
router.get("/all", getAllAdmins);
/* -------------------------------- LEVEL -------------------------------- */

// Récupérer tous les niveaux
router.get("/levels", async (req, res) => {
    try {
        const levels = await Level.find().populate("category", "name");
        res.json(levels);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Ajouter un niveau
router.post("/levels", async (req, res) => {
    try {
        const { name, category } = req.body;
        const newLevel = new Level({ name, category });
        await newLevel.save();
        res.status(201).json(newLevel);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Modifier un niveau
router.put("/levels/:id", async (req, res) => {
    try {
        const updatedLevel = await Level.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLevel);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Supprimer un niveau
router.delete("/levels/:id", async (req, res) => {
    try {
        await Level.findByIdAndDelete(req.params.id);
        res.json({ message: "Niveau supprimé" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* -------------------------------- FILIERE -------------------------------- */

// Récupérer toutes les filières
router.get("/filieres", async (req, res) => {
    try {
        const filieres = await Filiere.find().populate("level", "name");
        res.json(filieres);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Ajouter une filière
router.post("/filieres", async (req, res) => {
    try {
        const { nom, level } = req.body;
        const newFiliere = new Filiere({ nom, level });
        await newFiliere.save();
        res.status(201).json(newFiliere);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Modifier une filière
router.put("/filieres/:id", async (req, res) => {
    try {
        const updatedFiliere = await Filiere.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFiliere);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Supprimer une filière
router.delete("/filieres/:id", async (req, res) => {
    try {
        await Filiere.findByIdAndDelete(req.params.id);
        res.json({ message: "Filière supprimée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* -------------------------------- SUBJECT -------------------------------- */

// Récupérer toutes les matières
router.get("/subjects", async (req, res) => {
    try {
        const subjects = await Subject.find().populate("level", "name").populate("filiere", "nom");
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Ajouter une matière
router.post("/subjects", async (req, res) => {
    try {
        const { nom, level, filiere } = req.body;
        const newSubject = new Subject({ nom, level, filiere });
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Modifier une matière
router.put("/subjects/:id", async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSubject);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Supprimer une matière
router.delete("/subjects/:id", async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Matière supprimée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* -------------------------------- COURSE -------------------------------- */

// Récupérer tous les cours
router.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Ajouter un cours
router.post("/courses", async (req, res) => {
    try {
        const { title, description, subject } = req.body;
        const newCourse = new Course({ title, description, subject });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Modifier un cours
router.put("/courses/:id", async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCourse);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Supprimer un cours
router.delete("/courses/:id", async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Cours supprimé" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* -------------------------- TYPE DE RESSOURCE -------------------------- */

router.get("/all", async (req, res) => {
    try {
      const types = await TypeRessource.find().populate("cours");
      res.json(types);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
      const type = await TypeRessource.findById(req.params.id).populate("cours");
      if (!type) return res.status(404).json({ message: "Type de ressource non trouvé" });
      res.json(type);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
      const type = new TypeRessource(req.body);
      await type.save();
      res.status(201).json(type);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
      const type = await TypeRessource.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!type) return res.status(404).json({ message: "Type de ressource non trouvé" });
      res.json(type);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
      const type = await TypeRessource.findByIdAndDelete(req.params.id);
      if (!type) return res.status(404).json({ message: "Type de ressource non trouvé" });
      res.json({ message: "Type de ressource supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


/* ------------------------------- RESSOURCE ------------------------------- */

router.get("/all", async (req, res) => {
    try {
        const ressources = await Ressource.find().populate("cours_id type_ressource_id");
        res.json(ressources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const ressource = await Ressource.findById(req.params.id).populate("cours_id type_ressource_id");
        if (!ressource) return res.status(404).json({ message: "Ressource non trouvée" });
        res.json(ressource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const ressource = new Ressource(req.body);
        await ressource.save();
        res.status(201).json(ressource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const ressource = await Ressource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ressource) return res.status(404).json({ message: "Ressource non trouvée" });
        res.json(ressource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const ressource = await Ressource.findByIdAndDelete(req.params.id);
        if (!ressource) return res.status(404).json({ message: "Ressource non trouvée" });
        res.json({ message: "Ressource supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
