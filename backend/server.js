const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const Filiere = require('./models/Filiere');

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();


// Activation de CORS pour éviter les erreurs CORS
app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Connexion à MongoDB
connectDB();

// Middleware pour lire JSON
app.use(express.json());

// Routes
app.use("/uploads", express.static("uploads"));

app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/levels', require('./routes/levelRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use("/api/filieres", require("./routes/filiereRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/typeressources", require("./routes/trRoutes"));
app.use("/api/ressources", require("./routes/ressourceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


// Your other routes and middleware
app.get('/api/levels/:id', (req, res) => {
  // Your code to handle the request
});

fetch("http://localhost:5000/api/levels/name/:name")
fetch("http://localhost:5000/api/subjects")


const transporter = nodemailer.createTransport({
  service: "gmail", // Utilisez votre service de messagerie (ex: Gmail, Outlook, etc.)
  auth: {
    user: "nataalamacademy@gmail.com", // Remplacez par votre email
    pass: "e-learning nataalam2", // Remplacez par votre mot de passe
  },
});

app.post("/api/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: "nataalamacademy@gmail.com", // Remplacez par votre email
    to: "ayaelhabib9@gmail.com", // Email de l'admin
    subject: "Nouveau message de contact 'nataalam'",
    text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message envoyé avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
});


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));

