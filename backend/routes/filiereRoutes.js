const express = require("express");
const router = express.Router();
const Filiere = require("../models/Filiere");

// 📌 Récupérer toutes les filières d'un niveau spécifique
router.get("/:levelId", async (req, res) => {
  try {
    const filieres = await Filiere.find({ level: req.params.levelId });
    res.status(200).json(filieres);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des filières", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const filieres = await Filiere.find();
    res.json(filieres);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


// ✅ Route pour ajouter une filière
router.post("/", async (req, res) => {
  try {
    const { nom, level, category } = req.body;

    // Vérifier si la filière existe déjà pour ce niveau et cette catégorie
    const existingFiliere = await Filiere.findOne({ nom, level, category });
    if (existingFiliere) {
      return res.status(400).json({ message: "Cette filière existe déjà." });
    }

    // Créer une nouvelle filière
    const newFiliere = new Filiere({ nom, level, category });

    // Sauvegarde dans la base de données
    await newFiliere.save();

    res.status(201).json({ message: "Filière ajoutée avec succès", filiere: newFiliere });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const filiere = await Filiere.findByIdAndDelete(req.params.id);
    if (!filiere) {
      return res.status(404).json({ message: "Filière non trouvée" });
    }
    res.json({ message: "Filière supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});


// Modifier une filière par ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    // Vérifier que le nom est fourni
    if (!nom) {
      return res.status(400).json({ message: "Le champ 'nom' est requis." });
    }

    // Mettre à jour la filière
    const updatedFiliere = await Filiere.findByIdAndUpdate(
      id,
      { nom },
      { new: true, runValidators: true } // Retourne la filière mise à jour et valide les données
    );

    if (!updatedFiliere) {
      return res.status(404).json({ message: "Filière non trouvée" });
    }

    res.status(200).json(updatedFiliere);
  } catch (error) {
    console.error("Erreur lors de la modification de la filière :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

module.exports = router;
