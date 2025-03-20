const { body, param } = require('express-validator');
const User = require('../models/User');

exports.validateUserCreation = [
  body('name')
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Format d\'email invalide')
    .custom(async value => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }
      return true;
    }),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Rôle non valide')
];

exports.validateUserUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Format d\'email invalide')
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        throw new Error('Cet email est déjà utilisé');
      }
      return true;
    }),
  
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Rôle non valide')
];

exports.validateUserId = [
  param('id')
    .isMongoId().withMessage('ID d\'utilisateur non valide')
];