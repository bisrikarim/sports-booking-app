const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateBooking, validateBookingId, validateBookingUpdate } = require('../validations/bookingValidation');
const { validate } = require('../middlewares/validationMiddleware');

// Routes avec validation
router.get('/', authMiddleware, bookingController.getAllBookings);
router.post('/', authMiddleware, validateBooking, validate, bookingController.createBooking);
router.get('/user', authMiddleware, bookingController.getUserBookings); // Cette route est nécessaire
router.get('/:id', authMiddleware, validateBookingId, validate, bookingController.getBookingById);
router.put('/:id', authMiddleware, validateBookingId, validateBookingUpdate, validate, bookingController.updateBooking);
router.put('/:id/confirm', authMiddleware, validateBookingId, validate, bookingController.confirmBooking);
router.delete('/:id', authMiddleware, validateBookingId, validate, bookingController.deleteBooking);
router.put('/:id/cancel', authMiddleware, validateBookingId, validate, bookingController.cancelBooking);

module.exports = router;