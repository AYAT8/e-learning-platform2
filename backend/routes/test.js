const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/test-db', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({ message: "Connexion réussie !", collections });
    } catch (error) {
        res.status(500).json({ message: "Erreur de connexion", error });
    }
});

module.exports = router;
