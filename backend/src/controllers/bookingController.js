const Booking = require('../models/Booking');
const Field = require('../models/Field');
const User = require('../models/User');

const MAX_BOOKINGS_PER_USER = 2; // 2 réservations max par jour
const MAX_RESERVATION_DAYS = 30; // Max 30 jours à l'avance

exports.createBooking = async (req, res) => {
    try {
        const { user, field, date, timeSlot } = req.body;

        const today = new Date();
        const reservationDate = new Date(date);

        // ✅ Vérifier si la date est valide
        if (reservationDate < today) {
            return res.status(400).json({ error: "Impossible de réserver pour une date passée." });
        }
        if ((reservationDate - today) / (1000 * 60 * 60 * 24) > MAX_RESERVATION_DAYS) {
            return res.status(400).json({ error: `Impossible de réserver à plus de ${MAX_RESERVATION_DAYS} jours à l'avance.` });
        }

        // ✅ Vérifier le nombre de réservations de l'utilisateur pour cette date
        const userBookingsCount = await Booking.countDocuments({ user, date });

        if (userBookingsCount >= MAX_BOOKINGS_PER_USER) {
            return res.status(400).json({ error: `Vous avez atteint la limite de ${MAX_BOOKINGS_PER_USER} réservations pour cette journée.` });
        }

        // ✅ Vérifier si le terrain est déjà réservé pour ce créneau
        const existingBooking = await Booking.findOne({ field, date, timeSlot });
        if (existingBooking) {
            return res.status(400).json({ error: "Ce terrain est déjà réservé pour ce créneau horaire." });
        }

        // ✅ Créer la réservation
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ error: 'Réservation non trouvée' });

        const currentTime = new Date();
        const bookingTime = new Date(booking.date);

        // ✅ Empêcher l'annulation < 24h avant
        if (status === "cancelled" && (bookingTime - currentTime) < (24 * 60 * 60 * 1000)) {
            return res.status(400).json({ error: "Impossible d'annuler la réservation moins de 24h à l'avance." });
        }

        // ✅ Mettre à jour la réservation
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBooking);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "confirmed" },
            { new: true }
        );
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }
        const bookings = await Booking.find(query).populate('user').populate('field');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user').populate('field');
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Réservation non trouvée' });
        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};