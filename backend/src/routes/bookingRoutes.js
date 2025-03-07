const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// ✅ Routes protégées par JWT
router.get('/', authMiddleware, bookingController.getAllBookings);
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.put('/:id', authMiddleware, bookingController.updateBooking);
router.put('/:id/confirm', authMiddleware, bookingController.confirmBooking);
router.delete('/:id', authMiddleware, bookingController.deleteBooking);
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);


module.exports = router;
