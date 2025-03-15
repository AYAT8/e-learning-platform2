const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://nataalam:nataalamMGDB@e-learning.roxir.mongodb.net/e-learning?retryWrites=true&w=majority";

async function testConnexion() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connexion réussie à MongoDB Atlas !");
    console.log("🔹 Hôte connecté :", mongoose.connection.host);
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
  } finally {
    mongoose.disconnect();
  }
}

testConnexion();
