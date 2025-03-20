const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateField, validateFieldId } = require('../validations/fieldValidation');
const { validate } = require('../middlewares/validationMiddleware');

// Middleware admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Accès refusé. Réservé aux administrateurs." });
    }
    next();
};

// Routes avec validation
router.post('/', authMiddleware, adminMiddleware, validateField, validate, fieldController.createField);
router.get('/', fieldController.getAllFields);
router.get('/:id', validateFieldId, validate, fieldController.getFieldById);
router.put('/:id', authMiddleware, adminMiddleware, validateFieldId, validateField, validate, fieldController.updateField);
router.delete('/:id', authMiddleware, adminMiddleware, validateFieldId, validate, fieldController.deleteField);

module.exports = router;
