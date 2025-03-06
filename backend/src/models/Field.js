const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    sportType: { type: String, enum: ['football', 'basketball', 'tennis', 'padel'], required: true },
    pricePerHour: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Field', FieldSchema);
