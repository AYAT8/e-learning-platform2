const mongoose = require("mongoose");

const RessourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  id_category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  id_level: { type: mongoose.Schema.Types.ObjectId, ref: "Level", required: true },
  id_filier: { type: mongoose.Schema.Types.ObjectId, ref: "Filiere", default: null },
  id_subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  id_course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  id_type_ressource: { type: mongoose.Schema.Types.ObjectId, ref: "TypeRessource", required: true },
  url: { type: String, required: true },
  image_url: { type: String },
  date_ajout: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ressource", RessourceSchema);