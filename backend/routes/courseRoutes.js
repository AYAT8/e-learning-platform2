const express = require("express");
const Course = require("../models/Course"); // Assure-toi du bon chemin vers le modèle
const router = express.Router();

// ✅ Récupérer tous les cours
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("subject"); // Récupère aussi les détails du sujet
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des cours", error });
  }
});

// ✅ Récupérer un cours par son ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("subject");
    if (!course) return res.status(404).json({ message: "Cours non trouvé" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du cours", error });
  }
});


// Route pour ajouter un cours
router.post("/", async (req, res) => {
  try {
      const { title, description, subject, category, level, filiere = null } = req.body;

      // Vérifier que tous les champs requis sont fournis (sans filiere)
      if (!title || !description || !subject || !category || !level) {
          return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis." });
      }

      // Création du nouveau cours
      const newCourse = new Course({
          title,
          description,
          subject,
          category,
          level,
          filiere
      });

      // Enregistrer le cours dans la base de données
      const savedCourse = await newCourse.save();

      res.status(201).json({ message: "Cours ajouté avec succès", course: savedCourse });
  } catch (error) {
      console.error("Erreur lors de l'ajout du cours:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
  }
});




module.exports = router;
// ✅ Récupérer tous les cours liés à un subject spécifique
router.get("/subject/:subjectId", async (req, res) => {
  try {
    const courses = await Course.find({ subject: req.params.subjectId }).populate("subject");
    res.status(200).json(courses); // Toujours retourner une réponse 200 même si la liste est vide
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des cours par sujet", error });
  }
});

// ✅ Route pour supprimer un cours par ID
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    // Supprimer le cours de la base de données
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "✅ Cours supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
});

// Modifier un cours
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Erreur lors de la modification du cours :", error);
    res.status(500).json({ message: "Erreur lors de la modification du cours" });
  }
});

module.exports = router;

  // GET /api/courses/:subjectId