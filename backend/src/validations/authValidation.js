const { body } = require('express-validator');

exports.validateRegister = [
  body('name')
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Format d\'email invalide'),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Rôle non valide')
];

exports.validateLogin = [
  body('email')
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Format d\'email invalide'),
  
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];