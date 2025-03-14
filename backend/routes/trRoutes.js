const express = require("express");
const TypeRessource = require("../models/TypeRessource");
const router = express.Router();

// ✅ Ajouter un type de ressource
router.post("/", async (req, res) => {
  try {
    const { nom, cours, category, level, subject, filiere } = req.body;

    const newTypeRessource = new TypeRessource({
      nom,
      cours,
      category,
      level,
      subject,
      filiere: filiere || null // Peut être null si non fourni
    });

    await newTypeRessource.save();
    res.status(201).json(newTypeRessource);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'ajout du type de ressource", error });
  }
});

// ✅ Récupérer tous les types de ressources avec les références peuplées
router.get("/", async (req, res) => {
  try {
    const typesRessources = await TypeRessource.find()
      .populate("cours")
      .populate("category")
      .populate("level")
      .populate("subject")
      .populate("filiere");

    res.status(200).json(typesRessources);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des types de ressources", error });
  }
});

// ✅ Récupérer les types de ressources d'un cours spécifique
router.get("/cours/:coursId", async (req, res) => {
  try {
    const typesRessources = await TypeRessource.find({ cours: req.params.coursId })
      .populate("cours")
      .populate("category")
      .populate("level")
      .populate("subject")
      .populate("filiere");

    res.status(200).json(typesRessources);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des types de ressources", error });
  }
});

// ✅ Récupérer les types de ressources d'une catégorie spécifique
router.get("/category/:categoryId", async (req, res) => {
  try {
    const typesRessources = await TypeRessource.find({ category: req.params.categoryId })
      .populate("cours")
      .populate("category")
      .populate("level")
      .populate("subject")
      .populate("filiere");

    res.status(200).json(typesRessources);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des types de ressources par catégorie", error });
  }
});

// ✅ Mettre à jour un type de ressource
router.put("/:id", async (req, res) => {
  try {
    const { nom, cours, category, level, subject, filiere } = req.body;

    const updatedTypeRessource = await TypeRessource.findByIdAndUpdate(
      req.params.id,
      { nom, cours, category, level, subject, filiere: filiere || null },
      { new: true }
    );

    if (!updatedTypeRessource) {
      return res.status(404).json({ message: "Type de ressource non trouvé" });
    }

    res.status(200).json(updatedTypeRessource);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du type de ressource", error });
  }
});

// ✅ Supprimer un type de ressource
router.delete("/:id", async (req, res) => {
  try {
    const deletedTypeRessource = await TypeRessource.findByIdAndDelete(req.params.id);

    if (!deletedTypeRessource) {
      return res.status(404).json({ message: "Type de ressource non trouvé" });
    }

    res.status(200).json({ message: "Type de ressource supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du type de ressource", error });
  }
});

// Modifier un type de ressource par ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    // Vérifier que le nom est fourni
    if (!nom) {
      return res.status(400).json({ message: "Le champ 'nom' est requis." });
    }

    // Mettre à jour le type de ressource
    const updatedTypeRessource = await TypeRessource.findByIdAndUpdate(
      id,
      { nom },
      { new: true, runValidators: true } // Retourne le type de ressource mis à jour et valide les données
    );

    if (!updatedTypeRessource) {
      return res.status(404).json({ message: "Type de ressource non trouvé" });
    }

    res.status(200).json(updatedTypeRessource);
  } catch (error) {
    console.error("Erreur lors de la modification du type de ressource :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// ✅ Récupérer un type de ressource par ID
router.get("/:id", async (req, res) => {
  try {
    const typeRessource = await TypeRessource.findById(req.params.id)
      .populate("cours")
      .populate("category")
      .populate("level")
      .populate("subject")
      .populate("filiere");

    if (!typeRessource) {
      return res.status(404).json({ message: "Type de ressource non trouvé" });
    }

    res.status(200).json(typeRessource);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du type de ressource", error });
  }
});

module.exports = router;
module.exports = router;
