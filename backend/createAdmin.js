const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin"); // Assure-toi que ce chemin est correct

mongoose.connect("mongodb://127.0.0.1:27017/e-learning", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash("All_Amine_1992", 10); 
        const admin = new Admin({
            name: "Amine",
            email: "nataalamacademy@gmail.com",
            password: hashedPassword
        });

        await admin.save();
        console.log("✅ Admin créé avec succès !");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Erreur lors de la création de l’admin :", error);
        mongoose.connection.close();
    }
};

createAdmin();
