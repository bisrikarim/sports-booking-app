// src/app/admin/bookings/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllBookings, updateBookingStatus, cancelBooking, confirmBooking } from '@/services/bookings';
import { getAllFields } from '@/services/fields';
import Link from 'next/link';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    status: '',
    from: '',
    to: '',
    field: ''
  });

  // Fonction pour charger les données
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Log des filtres pour déboguer
      console.log('Filtres appliqués:', filters);
      
      // Récupérer les données
      const [bookingsData, fieldsData] = await Promise.all([
        getAllBookings(filters),
        getAllFields()
      ]);
      
      console.log('Réservations reçues:', bookingsData);
      
      // S'assurer que les données sont bien des tableaux
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setFields(Array.isArray(fieldsData) ? fieldsData : []);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError("Impossible de charger les données: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au chargement de la page
  useEffect(() => {
    fetchData();
  }, []);

  // Mettre à jour les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Appliquer les filtres
  const applyFilters = () => {
    fetchData();
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      status: '',
      from: '',
      to: '',
      field: ''
    });
    // Recharger les données avec les filtres réinitialisés
    setTimeout(fetchData, 0);
  };

  // Confirmer une réservation
  const handleConfirmBooking = async (bookingId) => {
    try {
      setProcessing(true);
      await confirmBooking(bookingId);
      
      // Mettre à jour la liste des réservations
      const updatedBookings = bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
      );
      
      setBookings(updatedBookings);
      alert('Réservation confirmée avec succès');
    } catch (err) {
      console.error('Erreur lors de la confirmation:', err);
      alert(`Erreur lors de la confirmation: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Annuler une réservation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      return;
    }
    
    try {
      setProcessing(true);
      await cancelBooking(bookingId);
      
      // Mettre à jour la liste des réservations
      const updatedBookings = bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      
      setBookings(updatedBookings);
      alert('Réservation annulée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      alert(`Erreur lors de l'annulation: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Erreur de formatage de date:', err);
      return dateString;
    }
  };

  // Obtenir le nom du terrain à partir de son ID
  const getFieldName = (field) => {
    console.log("Field reçu:", field);
    
    // Si field est déjà un objet avec un nom, l'utiliser directement
    if (field && typeof field === 'object' && field.name) {
      console.log("Utilisation du nom déjà présent:", field.name);
      return field.name;
    }
    
    // Extraire l'ID
    const fieldId = field && typeof field === 'object' ? field._id : field;
    console.log("ID du terrain extrait:", fieldId);
    
    // Chercher dans la liste des terrains
    const foundField = fields.find(f => f._id === fieldId);
    console.log("Terrain trouvé:", foundField);
    
    return foundField ? foundField.name : 'Terrain inconnu';
  };

  // Obtenir le nom d'utilisateur
  const getUserName = (user) => {
    if (!user) return 'Utilisateur inconnu';
    if (typeof user === 'string') return user;
    return user.name || user.email || 'Utilisateur ' + user._id;
  };

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-black hover:bg-gray-800 transition-colors text-white px-4 py-2 rounded-lg"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestion des réservations</h1>
            <p className="text-gray-500">Gérez toutes les réservations des utilisateurs</p>
          </div>
          <Link 
            href="/admin/bookings/new" 
            className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Nouvelle réservation
          </Link>
        </div>
        
        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Statut</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Terrain</label>
                <select
                  name="field"
                  value={filters.field}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                >
                  <option value="">Tous les terrains</option>
                  {fields.map(field => (
                    <option key={field._id} value={field._id}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Du</label>
                <input
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Au</label>
                <input
                  type="date"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
        
        {/* Liste des réservations */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-gray-800 text-xl font-semibold mb-2">Aucune réservation trouvée</h3>
              <p className="text-gray-500 mb-6">Ajoutez une nouvelle réservation ou modifiez vos filtres</p>
              <Link
                href="/admin/bookings/new"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Nouvelle réservation
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-gray-500 font-semibold">ID</th>
                    <th className="px-6 py-4 text-gray-500 font-semibold">Terrain</th>
                    <th className="px-6 py-4 text-gray-500 font-semibold">Date</th>
                    <th className="px-6 py-4 text-gray-500 font-semibold">Créneau</th>
                    <th className="px-6 py-4 text-gray-500 font-semibold">Utilisateur</th>
                    <th className="px-6 py-4 text-gray-500 font-semibold">Statut</th>
                    <th className="px-6 py-4 text-gray-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {getFieldName(booking.field)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {formatDate(booking.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {booking.timeSlot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {getUserName(booking.user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {booking.status === 'confirmed' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                          {booking.status === 'cancelled' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                          )}
                          {booking.status === 'pending' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                            </svg>
                          )}
                          {booking.status === 'confirmed' ? 'Confirmé' : 
                           booking.status === 'cancelled' ? 'Annulé' : 
                           'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleConfirmBooking(booking._id)}
                              disabled={processing}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={processing}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                              Annuler
                            </button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={processing}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Annuler
                          </button>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className="text-gray-400">Aucune action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}