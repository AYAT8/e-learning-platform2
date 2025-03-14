
const express = require("express");
const Ressource = require("../models/Ressource");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");
const TypeRessource = require("../models/TypeRessource");
const fs = require("fs");

const router = express.Router();



// Route pour récupérer toutes les ressources
router.get("/", async (req, res) => {
  try {
    const ressources = await Ressource.find()
      .populate("id_category", "name")
      .populate("id_level", "name")
      .populate("id_filier", "name")
      .populate("id_subject", "name")
      .populate("id_course", "name")
      .populate("id_type_ressource", "name");

    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des ressources", error });
  }
});

module.exports = router;


// ✅ Route pour ajouter une ressource

router.post("/ajouter", upload.single("fichier"), async (req, res) => {
    try {
        console.log("Fichier reçu :", req.file); // Vérifiez que le fichier est bien présent
        console.log("Données du formulaire :", req.body); // Vérifiez les autres champs

        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier envoyé ou type de fichier non supporté." });
        }

        const { title, id_category, id_level, id_filier, id_subject, id_course, id_type_ressource } = req.body;

        // Déterminer le type de ressource pour Cloudinary
        let resourceType = "auto";
        if (req.file.mimetype.includes("video")) {
            resourceType = "video";
        } else if (req.file.mimetype.includes("pdf") || req.file.mimetype.includes("document")) {
            resourceType = "raw";
        }

        // Upload vers Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: resourceType,
            folder: "ressources",
        });
        console.log("Résultat Cloudinary :", result);

        // Créer la ressource dans la base de données
        const nouvelleRessource = new Ressource({
            title,
            id_category,
            id_level,
            id_filier: id_filier || null,
            id_subject,
            id_course,
            id_type_ressource,
            url: result.secure_url,
            image_url: req.file.mimetype.includes("image") ? result.secure_url : null,
            date_ajout: new Date(),
        });

        await nouvelleRessource.save();

        // Supprimer le fichier temporaire
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json({
            message: "✅ Ressource ajoutée avec succès",
            ressource: nouvelleRessource,
        });
    } catch (error) {
        console.error("❌ Erreur :", error);
        res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
});


// ✅ Route pour récupérer toutes les ressources
router.get("/toutes", async (req, res) => {
  try {
    const ressources = await Ressource.find().populate("id_category id_level id_filier id_subject id_course id_type_ressource");
    res.status(200).json(ressources);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
});

// ✅ Route pour récupérer une ressource par ID
router.get("/:id", async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id).populate("id_category id_level id_filier id_subject id_course id_type_ressource");
    if (!ressource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }
    res.status(200).json(ressource);
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
});


router.get("/typeressources/:id_type_ressourceId", async (req, res) => {
  try {
    const typeRessource = await Ressource.find({id_type_ressource:req.params.id_type_ressourceId}).populate("id_category id_level id_filier id_subject id_course id_type_ressource");
    if (!typeRessource) {
      return res.status(404).json({ message: "Type de ressource non trouvé" });
    }
    res.status(200).json(typeRessource);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
});


// ✅ Route pour supprimer une ressource par ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la ressource existe
    const ressource = await Ressource.findById(id);
    if (!ressource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }

    // Supprimer la ressource de Cloudinary (si applicable)
    if (ressource.url) {
      const publicId = ressource.url.split("/").pop().split(".")[0]; // Extraire l'ID public de l'URL
      await cloudinary.uploader.destroy(`ressources/${publicId}`);
    }

    // Supprimer la ressource de la base de données
    await Ressource.findByIdAndDelete(id);

    res.status(200).json({ message: "Ressource supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
});


// ✅ Route pour modifier une ressource par ID (title et url)
router.put("/:id", upload.single("fichier"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Vérifier si la ressource existe
    const ressource = await Ressource.findById(id);
    if (!ressource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }

    // Mettre à jour le titre
    if (title) {
      ressource.title = title;
    }

    // Mettre à jour l'URL si un nouveau fichier est fourni
    if (req.file) {
      // Supprimer l'ancien fichier de Cloudinary (si applicable)
      if (ressource.url) {
        const publicId = ressource.url.split("/").pop().split(".")[0]; // Extraire l'ID public de l'URL
        await cloudinary.uploader.destroy(`ressources/${publicId}`);
      }

      // Déterminer le type de ressource pour Cloudinary
      let resourceType = "auto";
      if (req.file.mimetype.includes("video")) {
        resourceType = "video";
      } else if (req.file.mimetype.includes("pdf") || req.file.mimetype.includes("document")) {
        resourceType = "raw";
      }

      // Uploader le nouveau fichier vers Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: resourceType,
        folder: "ressources",
      });

      // Mettre à jour l'URL dans la ressource
      ressource.url = result.secure_url;

      // Supprimer le fichier temporaire
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Sauvegarder les modifications
    await ressource.save();

    res.status(200).json({
      message: "✅ Ressource modifiée avec succès",
      ressource,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la modification :", error);
    res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
  }
});


module.exports = router;
