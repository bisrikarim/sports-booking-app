const { body, param, query } = require('express-validator');

// Validation pour la création et mise à jour de terrain
exports.validateField = [
  body('name')
    .notEmpty().withMessage('Le nom du terrain est requis')
    .isLength({ min: 3, max: 50 }).withMessage('Le nom doit contenir entre 3 et 50 caractères'),
  
  body('location')
    .notEmpty().withMessage('L\'emplacement est requis')
    .isLength({ min: 5, max: 100 }).withMessage('L\'emplacement doit contenir entre 5 et 100 caractères'),
  
  body('sportType')
    .notEmpty().withMessage('Le type de sport est requis')
    .isIn(['football', 'basketball', 'tennis', 'padel']).withMessage('Type de sport non valide'),
  
  body('pricePerHour')
    .notEmpty().withMessage('Le prix par heure est requis')
    .isNumeric().withMessage('Le prix doit être un nombre')
    .custom(value => value > 0).withMessage('Le prix doit être supérieur à 0')
];

// Validation pour le paramètre ID
exports.validateFieldId = [
  param('id')
    .isMongoId().withMessage('ID de terrain non valide')
];