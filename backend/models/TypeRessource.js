const mongoose = require("mongoose");

const typeRessourceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  cours: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  level: { type: mongoose.Schema.Types.ObjectId, ref: "Level", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  filiere: { type: mongoose.Schema.Types.ObjectId, ref: "Filiere", required: false } // Peut être null
});

const TypeRessource = mongoose.model("TypeRessource", typeRessourceSchema);

module.exports = TypeRessource;
