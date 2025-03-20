const { body, param } = require('express-validator');
const mongoose = require('mongoose');

exports.validateBooking = [
  body('field')
    .notEmpty().withMessage('L\'ID du terrain est requis')
    .isMongoId().withMessage('ID de terrain non valide'),
  
  body('date')
    .notEmpty().withMessage('La date est requise')
    .isISO8601().withMessage('Format de date invalide')
    .custom(date => new Date(date) >= new Date()).withMessage('La date doit être future'),
  
  body('timeSlot')
    .notEmpty().withMessage('Le créneau horaire est requis')
    .matches(/^([01]\d|2[0-3]):00-([01]\d|2[0-3]):00$/).withMessage('Format de créneau horaire invalide (ex: 14:00-15:00)')
    .custom((value) => {
      // Extraction des heures de début et de fin
      const [start, end] = value.split('-').map(time => parseInt(time.split(':')[0]));
      return start < end; // Vérifier que l'heure de début est avant l'heure de fin
    }).withMessage('L\'heure de début doit être avant l\'heure de fin'),
];

exports.validateBookingId = [
  param('id')
    .isMongoId().withMessage('ID de réservation non valide')
];

exports.validateBookingUpdate = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled']).withMessage('Statut non valide'),
  
  // Vous pouvez ajouter d'autres champs qui peuvent être mis à jour
];