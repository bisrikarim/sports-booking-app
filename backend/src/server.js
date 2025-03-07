const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware pour JSON
app.use(express.json());

// Importation des routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/fields', require('./routes/fieldRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));



// Connexion MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://mongo:27017/reservation_db";
mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("error", (err) => {
    console.error("⚠️ MongoDB connection lost:", err);
});

// Vérifie que ton serveur tourne bien sur l'API et pas sur le frontend
app.get('/', (req, res) => {
    res.json({ message: "Backend API is running!" });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Port du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
