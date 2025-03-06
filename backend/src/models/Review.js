// models/Review.js
const mongoose = require('mongoose'); // Ajout de l'import mongoose
const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);