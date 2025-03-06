// controllers/fieldController.js
const Field = require('../models/Field');

exports.createField = async (req, res) => {
    try {
        const field = new Field(req.body);
        await field.save();
        res.status(201).json(field);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllFields = async (req, res) => {
    try {
        const fields = await Field.find();
        res.json(fields);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFieldById = async (req, res) => {
    try {
        const field = await Field.findById(req.params.id);
        if (!field) return res.status(404).json({ error: 'Field not found' });
        res.json(field);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateField = async (req, res) => {
    try {
        const field = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!field) return res.status(404).json({ error: 'Field not found' });  // ✅ Vérifie bien que c'est "Field"
        res.json(field);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteField = async (req, res) => {
    try {
        const field = await Field.findByIdAndDelete(req.params.id);
        if (!field) return res.status(404).json({ error: 'Field not found' });
        res.json({ message: 'Field deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};