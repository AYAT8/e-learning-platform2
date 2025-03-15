const mongoose = require("mongoose");

const connectDB = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      console.log("✅ Connexion réussie à MongoDB Atlas !");
  } catch (err) {
      console.error("❌ Erreur de connexion à MongoDB :", err);
      process.exit(1); // Quitte l'application si la connexion échoue
  }
};
module.exports = connectDB;
