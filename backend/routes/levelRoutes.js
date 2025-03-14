const express = require("express");
const router = express.Router();
const Level = require("../models/Level");
const Category = require("../models/Category"); 
// ✅ Route pour récupérer **tous les niveaux**
router.get("/", async (req, res) => {
  try {
    const levels = await Level.find();
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const level = await Level.findById(id); // ✅ Supprimé .populate("subjects")

    if (!level) {
      return res.status(404).json({ message: "Niveau non trouvée." });
    }

    res.json(level);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
// ✅ Route pour récupérer les niveaux **par catégorie**
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const levels = await Level.find({ category })

    if (!levels.length) {
      return res.status(404).json({ message: "Aucun niveau trouvé pour cette catégorie." });
    }

    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ✅ Route pour récupérer un niveau **par nom**
router.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const levels = await Level.find({ name });

    if (!levels.length) {
      return res.status(404).json({ message: "Aucun niveau trouvé avec ce nom." });
    }

    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Ajouter un niveau
router.post("/", async (req, res) => {
  try {
    const { nom, category } = req.body;

    // Vérifier si les champs requis sont présents
    if (!nom || !category) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier si la catégorie existe
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Catégorie non trouvée" });
    }

    // Créer un nouveau niveau
    const newLevel = new Level({ nom, category });
    await newLevel.save();

    res.status(201).json({ message: "Niveau ajouté avec succès", level: newLevel });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const level = await Level.findByIdAndDelete(req.params.id);
    if (!level) {
      return res.status(404).json({ message: "Niveau non trouvé" });
    }
    res.json({ message: "Niveau supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});


// Modifier un niveau par ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    // Vérifier que le nom est fourni
    if (!nom) {
      return res.status(400).json({ message: "Le champ 'nom' est requis." });
    }

    // Mettre à jour le niveau
    const updatedLevel = await Level.findByIdAndUpdate(
      id,
      { nom },
      { new: true, runValidators: true } // Retourne le niveau mis à jour et valide les données
    );

    if (!updatedLevel) {
      return res.status(404).json({ message: "Niveau non trouvé" });
    }

    res.status(200).json(updatedLevel);
  } catch (error) {
    console.error("Erreur lors de la modification du niveau :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
module.exports = router;
