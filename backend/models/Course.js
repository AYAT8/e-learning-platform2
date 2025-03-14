const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Ajout de la catégorie
  level: { type: mongoose.Schema.Types.ObjectId, ref: "Level", required: true }, // Ajout du niveau
  filiere: { type: mongoose.Schema.Types.ObjectId, ref: "Filiere", default: null } // Ajout de la filière
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
