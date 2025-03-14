const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Accès refusé" });

    try {
        const verified = jwt.verify(token, "SECRET_KEY");
        if (verified.role !== "admin") return res.status(403).json({ message: "Accès non autorisé" });

        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Token invalide" });
    }
};

module.exports = authMiddleware;
