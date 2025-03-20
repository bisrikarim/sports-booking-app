// src/services/bookings.js
import api from './api';

export const createBooking = async (bookingData) => {
  try {
    console.log('createBooking - Données envoyées:', bookingData);
    // Utiliser le service API pour envoyer la requête
    const response = await api.post('/bookings', bookingData);
    console.log('createBooking - Réponse:', response);
    return response;
  } catch (error) {
    console.error('createBooking - Erreur:', error);
    throw error;
  }
};

export const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings/user');
    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    throw error;
  }
};

// Récupérer toutes les réservations (admin)
export const getAllBookings = async (filters = {}) => {
  try {
    let url = '/bookings';
    
    // Ajouter des filtres à l'URL si nécessaire
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.field) queryParams.append('field', filters.field);
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    console.log('URL de requête:', url); // Log pour déboguer
    const response = await api.get(url);
    
    // S'assurer que nous retournons les données, pas l'objet de réponse complet
    return response.data || response;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    throw error;
  }
};

// Mettre à jour le statut d'une réservation
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, { status });
    return response;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
};

// Annuler une réservation
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response;
  } catch (error) {
    // Propager l'erreur avec le message d'erreur du serveur si disponible
    const errorMessage = error.response?.data?.error || "Erreur lors de l'annulation";
    error.message = errorMessage;
    throw error;
  }
};

// Confirmer une réservation
export const confirmBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/confirm`);
    return response;
  } catch (error) {
    console.error("Erreur lors de la confirmation:", error);
    throw error;
  }
};

// Récupérer les détails d'une réservation
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error);
    throw error;
  }
};