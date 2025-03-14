const mongoose = require("mongoose");

const filiereSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  level: { type: mongoose.Schema.Types.ObjectId, ref: "Level", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
});

const Filiere = mongoose.model("Filiere", filiereSchema);

module.exports = Filiere;
