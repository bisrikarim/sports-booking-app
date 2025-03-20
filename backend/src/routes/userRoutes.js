const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateUserCreation, validateUserUpdate, validateUserId } = require('../validations/userValidation');
const { validate } = require('../middlewares/validationMiddleware');

// Middleware admin (si nécessaire)
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Accès refusé. Réservé aux administrateurs." });
  }
  next();
};

// Routes avec validation
router.post('/', validateUserCreation, validate, userController.createUser);
router.get('/', authMiddleware, adminMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, validateUserId, validate, userController.getUserById);
router.put('/:id', authMiddleware, validateUserId, validateUserUpdate, validate, userController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, validateUserId, validate, userController.deleteUser);

module.exports = router;