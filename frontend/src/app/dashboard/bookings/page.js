'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserBookings, cancelBooking } from '@/services/bookings';
import { isAuthenticated } from '@/services/auth';
import Link from 'next/link';

export default function UserBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err);
        setError('Impossible de charger vos réservations');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [router]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      return;
    }
    
    try {
      setProcessing(true);
      const response = await cancelBooking(bookingId);
      
      // Mettre à jour la liste des réservations
      const updatedBookings = bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      
      setBookings(updatedBookings);
      alert('Réservation annulée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      
      // Afficher le message d'erreur spécifique du serveur si disponible
      const errorMessage = err.response?.data?.error || "Erreur lors de l'annulation de la réservation";
      alert(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtenir le nom du terrain
  const getFieldName = (field) => {
    if (!field) return 'Terrain inconnu';
    return field.name || 'Terrain inconnu';
  };

  // Obtenir l'icône par type de sport
  const getSportTypeIcon = (field) => {
    if (!field || !field.sportType) return null;
    
    switch(field.sportType) {
      case 'football':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
            <path d="M12 2v4m0 16v-4m10-8h-4M6 12H2m17.5-5.5l-2.8 2.8M7.3 16.7l-2.8 2.8M19.7 16.7l-2.8-2.8M7.3 7.3L4.5 4.5" strokeLinecap="round" strokeWidth="1.5"/>
          </svg>
        );
      case 'basketball':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
            <path strokeLinecap="round" strokeWidth="1.5" d="M4.93 4.93L19.07 19.07M12 2v20M22 12H2"/>
          </svg>
        );
      case 'tennis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
            <path d="M18 3.5C16 8 16 16 18 20.5M6 3.5C8 8 8 16 6 20.5" strokeWidth="1.5"/>
          </svg>
        );
      case 'padel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5"/>
            <line x1="5" y1="12" x2="19" y2="12" strokeWidth="1.5"/>
            <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Filtrer les réservations selon l'onglet actif
  const filterBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'all') {
      return bookings;
    } else if (activeTab === 'upcoming') {
      return bookings.filter(booking => new Date(booking.date) >= today);
    } else if (activeTab === 'past') {
      return bookings.filter(booking => new Date(booking.date) < today);
    }
    return bookings;
  };

  const filteredBookings = filterBookings();

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
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Mes réservations</h1>
            <p className="text-gray-500">Gérez vos réservations de terrains sportifs</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/fields" 
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Réserver un terrain
            </Link>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'all'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                Toutes les réservations
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'upcoming'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                À venir
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'past'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                Passées
              </button>
            </nav>
          </div>
        </div>
        
        {/* Liste des réservations */}
        {bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-gray-800 text-xl font-bold mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore effectué de réservation</p>
            <Link href="/fields" className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Réserver un terrain
            </Link>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-gray-800 text-xl font-bold mb-2">Aucune réservation dans cette catégorie</h3>
            <p className="text-gray-500 mb-6">Essayez de consulter un autre onglet ou effectuez une nouvelle réservation</p>
            <Link href="/fields" className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Réserver un terrain
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => {
              const bookingDate = new Date(booking.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPast = bookingDate < today;
              
              return (
                <div 
                  key={booking._id} 
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                    booking.status === 'confirmed' 
                      ? 'border-green-500' 
                      : booking.status === 'cancelled' 
                        ? 'border-red-500' 
                        : 'border-yellow-500'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {getFieldName(booking.field)}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : booking.status === 'cancelled' ? (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                        {booking.status === 'confirmed' ? 'Confirmé' : 
                        booking.status === 'cancelled' ? 'Annulé' : 
                        'En attente'}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {booking.field && getSportTypeIcon(booking.field)}
                      <span className="ml-1.5 text-sm text-gray-600">
                        {booking.field?.sportType ? 
                          booking.field.sportType.charAt(0).toUpperCase() + booking.field.sportType.slice(1) : 
                          'Type inconnu'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{formatDate(booking.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{booking.timeSlot}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{booking.field?.location || 'Lieu inconnu'}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      {(booking.status === 'pending' || booking.status === 'confirmed') && !isPast ? (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={processing}
                          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Annuler
                        </button>
                      ) : booking.status === 'cancelled' ? (
                        <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center cursor-not-allowed">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Réservation annulée
                        </div>
                      ) : isPast ? (
                        <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center cursor-not-allowed">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Réservation passée
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}