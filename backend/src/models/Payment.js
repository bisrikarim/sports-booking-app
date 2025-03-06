
// models/Payment.js
const mongoose = require('mongoose'); // Ajout de l'import mongoose
const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['card', 'paypal', 'cash'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
