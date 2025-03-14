const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  nom: { 
    type: String,
    required: true,
    trim: true,
  },
  image: { type: String },
});

module.exports = mongoose.model("Category", CategorySchema);
