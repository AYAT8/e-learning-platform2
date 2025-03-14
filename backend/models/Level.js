const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

});

module.exports = mongoose.model("Level", LevelSchema);
