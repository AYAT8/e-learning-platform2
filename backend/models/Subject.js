const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Level",
    required: true,
  },
  filiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Filiere",
    default: null, // Null pour Primaire, Collège, Non-étudiants
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true, // Chaque matière appartient à une catégorie
  },
});

// Création d'un index unique sur level + filiere pour éviter les doublons
SubjectSchema.index({ level: 1, filiere: 1 }, { unique: true });

module.exports = mongoose.model("Subject", SubjectSchema);
