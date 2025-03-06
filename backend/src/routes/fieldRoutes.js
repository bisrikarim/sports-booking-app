const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');

// ✅ Vérifie que toutes les routes sont bien là
router.post('/', fieldController.createField);
router.get('/', fieldController.getAllFields);
router.get('/:id', fieldController.getFieldById);
router.put('/:id', fieldController.updateField);  // ✅ Cette ligne doit exister
router.delete('/:id', fieldController.deleteField);

module.exports = router;
