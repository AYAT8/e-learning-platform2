const express = require("express");
const router = express.Router();
const Category = require("../models/Category"); // Assure-toi que ce fichier existe
const upload = require("../middleware/multer"); // Assure-toi que le chemin est correct


router.post("/add-category", upload.single("image"), async (req, res) => {
  try {
    const { nom } = req.body; // ✅ Remplace "name" par "nom"
    const imagePath = req.file ? `uploads\\${req.file.filename}` : null;

    // Vérifier si la catégorie existe déjà
    const existingCategory = await Category.findOne({ nom }); // ✅ Vérifier avec "nom"
    if (existingCategory) {
      return res.status(400).json({ error: "Cette catégorie existe déjà !" });
    }

    const newCategory = new Category({ nom, image: imagePath }); // ✅ Stocker avec "nom"
    await newCategory.save();

    res.status(201).json({ message: "Catégorie ajoutée avec succès", category: newCategory });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la catégorie" });
  }
});


// Route pour récupérer toutes les catégories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Route pour récupérer une catégorie par son ID et ses matières
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id); // ✅ Supprimé .populate("subjects")

    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ nom: name }); // Assure-toi que "nom" est le champ correct

    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.get("/names", async (req, res) => {
  try {
    const { name } = req.params;
      const categories = await Category.find({ name }); // Assurez-vous d'inclure _id et name
      res.json(categories);
  } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des catégories." });
  }
});
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    // Vérifier si une nouvelle image est uploadée
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path; // Chemin de l'image uploadée
    }

    // Mettre à jour la catégorie
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        nom,
        ...(imagePath && { image: imagePath }), // Mettre à jour l'image seulement si elle est fournie
      },
      {
        new: true, // Retourne la catégorie mise à jour
        runValidators: true, // Valide les données avant la mise à jour
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Erreur lors de la modification de la catégorie :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});
module.exports = router;
