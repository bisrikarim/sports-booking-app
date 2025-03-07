const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Générer un token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        // 🛠 Vérification avant stockage
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Mot de passe haché avant stockage :", hashedPassword);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // 🛠 Vérification après stockage
        const savedUser = await User.findOne({ email });
        console.log("Mot de passe en base après insertion :", savedUser.password);

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






// Connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });

        console.log("Mot de passe en base :", user.password);
        console.log("Mot de passe entré :", password);

        // Vérifier si le mot de passe est correct
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Match :", isMatch);

        if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



