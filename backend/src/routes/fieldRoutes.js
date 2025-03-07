const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// ✅ Seuls les admins peuvent créer, modifier et supprimer des terrains
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Accès refusé. Réservé aux administrateurs." });
    }
    next();
};

router.post('/', authMiddleware, adminMiddleware, fieldController.createField);
router.get('/', fieldController.getAllFields);
router.get('/:id', fieldController.getFieldById);
router.put('/:id', authMiddleware, adminMiddleware, fieldController.updateField);
router.delete('/:id', authMiddleware, adminMiddleware, fieldController.deleteField);

module.exports = router;
