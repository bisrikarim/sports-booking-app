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
      console.log("Récupération des terrains...");
      // Ajoutez ce log pour voir quelle requête est exécutée
      
      const fields = await Field.find({ active: true });
      console.log("Terrains trouvés:", fields);
      
      res.json(fields);
    } catch (error) {
      console.error("Erreur:", error);
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
      const field = await Field.findByIdAndUpdate(
        req.params.id, 
        { active: false },
        { new: true }
      );
      
      if (!field) return res.status(404).json({ error: 'Terrain non trouvé' });
      res.json({ message: 'Terrain désactivé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };