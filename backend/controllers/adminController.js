const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'admin existe
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin non trouvé" });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Mot de passe correct ?", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            "SECRET_KEY", // Change "SECRET_KEY" par une vraie clé secrète !
            { expiresIn: "1h" }
        );

        res.json({ token, admin: { id: admin._id, email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }

    
};
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}, "-password"); // Ne pas envoyer les mots de passe
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};