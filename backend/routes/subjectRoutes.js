const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// 📌 Route pour récupérer toutes les matières
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find() // Récupère le nom du niveau associé
    res.json(subjects);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des matières :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ message: "Cours non trouvé" });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du cours", error });
  }
});

// ✅ Route pour ajouter une matière
router.post("/", async (req, res) => {
  try {
    const { nom, level, filiere, category } = req.body;

    // Vérification des champs requis
    if (!nom || !level || !category) {
      return res.status(400).json({ message: "Nom, level et category sont obligatoires." });
    }

    // Vérifier si la matière existe déjà avec le même niveau et la même filière
    const existingSubject = await Subject.findOne({ nom, level, filiere });
    if (existingSubject) {
      return res.status(400).json({ message: "Cette matière existe déjà pour ce niveau et cette filière." });
    }

    // Création de la nouvelle matière
    const newSubject = new Subject({ nom, level, filiere: filiere || null, category });

    // Sauvegarde en base de données
    await newSubject.save();

    res.status(201).json({ message: "Matière ajoutée avec succès", subject: newSubject });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Route pour récupérer les matières selon le niveau sélectionné
router.get("/level/:levelId", async (req, res) => {
  try {
      const subjects = await Subject.find({ level: req.params.levelId });
      res.json(subjects);
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Route pour récupérer les matières selon la filière sélectionnée
router.get("/filiere/:filiereId", async (req, res) => {
  try {
      const subjects = await Subject.find({ filiere: req.params.filiereId });
      res.json(subjects);
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    res.json({ message: "Matière supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});


// Modifier une matière par ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    // Vérifier que le nom est fourni
    if (!nom) {
      return res.status(400).json({ message: "Le champ 'nom' est requis." });
    }

    // Mettre à jour la matière
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { nom },
      { new: true, runValidators: true } // Retourne la matière mise à jour et valide les données
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }

    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error("Erreur lors de la modification de la matière :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
module.exports = router;
