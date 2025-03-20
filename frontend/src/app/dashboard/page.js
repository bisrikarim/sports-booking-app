// src/app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/services/auth';
import { getUserBookings } from '@/services/bookings';
import { getAllFields } from '@/services/fields';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [popularFields, setPopularFields] = useState([]);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer le nom d'utilisateur depuis le token
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserName(payload.name || 'Utilisateur');
        }
        
        // Vérifier si l'utilisateur est un administrateur
        setIsAdminUser(isAdmin());
        
        // Récupérer les réservations de l'utilisateur
        const bookingsResponse = await getUserBookings();
        const bookings = Array.isArray(bookingsResponse) 
          ? bookingsResponse 
          : (bookingsResponse.data || []);
        
        // Filtrer les réservations à venir
        const today = new Date();
        const upcoming = bookings
          .filter(booking => new Date(booking.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3); // Prendre les 3 prochaines réservations
        
        setUpcomingBookings(upcoming);
        
        // Récupérer quelques terrains pour affichage
        const fieldsData = await getAllFields();
        const fields = Array.isArray(fieldsData) ? fieldsData : [];
        setPopularFields(fields.slice(0, 3));
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Tableau de bord Administrateur
  if (isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* En-tête du tableau de bord admin */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
            <p className="opacity-90">Gérez les terrains, les réservations et les utilisateurs</p>
          </div>
        </div>
        
        {/* Contenu administrateur */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/bookings" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-purple-600">Gestion des réservations</h3>
              <p className="text-gray-600 mb-4">Voir et gérer toutes les réservations des utilisateurs</p>
              <div className="text-purple-600">Accéder →</div>
            </Link>
            
            <Link href="/admin/fields" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-green-600">Gestion des terrains</h3>
              <p className="text-gray-600 mb-4">Ajouter, modifier ou supprimer des terrains</p>
              <div className="text-green-600">Accéder →</div>
            </Link>
            
            <Link href="/admin/users" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-blue-600">Gestion des utilisateurs</h3>
              <p className="text-gray-600 mb-4">Gérer les comptes utilisateurs et leurs accès</p>
              <div className="text-blue-600">Accéder →</div>
            </Link>
          </div>
          
          {/* Statistiques et résumé */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Statistiques du système</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Réservations totales</p>
                <p className="text-2xl font-bold text-purple-700">{upcomingBookings.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Terrains actifs</p>
                <p className="text-2xl font-bold text-green-700">{popularFields.length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Réservations aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-700">0</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-orange-700">1</p>
              </div>
            </div>
          </div>
          
          {/* Actions avancées */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Actions avancées</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-gray-100 rounded-lg text-left hover:bg-gray-200 transition-colors">
                <h3 className="font-medium">Exporter les données</h3>
                <p className="text-sm text-gray-500">Télécharger les statistiques en CSV</p>
              </button>
              <button className="p-4 bg-gray-100 rounded-lg text-left hover:bg-gray-200 transition-colors">
                <h3 className="font-medium">Maintenance du système</h3>
                <p className="text-sm text-gray-500">Vérifier l'état du système</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tableau de bord Utilisateur standard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête du tableau de bord */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Bienvenue, {userName}</h1>
          <p className="opacity-90">Gérez vos réservations et trouvez de nouveaux terrains</p>
        </div>
      </div>
      
      {/* Cartes de statistiques */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Statistique 1 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="bg-blue-100 rounded-full p-4 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Réservations actives</p>
              <p className="text-2xl font-bold">{upcomingBookings.length}</p>
            </div>
          </div>
          
          {/* Statistique 2 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="bg-green-100 rounded-full p-4 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prochaine réservation</p>
              <p className="text-xl font-bold">
                {upcomingBookings.length > 0 
                  ? formatDate(upcomingBookings[0].date)
                  : "Aucune"}
              </p>
            </div>
          </div>
          
          {/* Statistique 3 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className="bg-purple-100 rounded-full p-4 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sports préférés</p>
              <p className="text-xl font-bold">Football</p>
            </div>
          </div>
        </div>
        
        {/* Sections principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prochaines réservations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Prochaines réservations</h2>
                <Link href="/dashboard/bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Voir tout
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingBookings.length === 0 ? (
                  <div className="py-8 px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore de réservations à venir</p>
                    <Link href="/fields" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      Réserver un terrain
                    </Link>
                  </div>
                ) : (
                  upcomingBookings.map((booking, index) => (
                    <div key={index} className="py-4 px-6 flex items-center">
                      <div className="bg-blue-100 rounded-md p-3 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">{booking.field?.name || 'Terrain'}</p>
                        <div className="flex space-x-4 text-sm mt-1">
                          <p className="text-gray-500">{formatDate(booking.date)}</p>
                          <p className="text-gray-500">{booking.timeSlot}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmé' : 
                        booking.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Terrains recommandés */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Terrains recommandés</h2>
              </div>
              <div className="p-6 space-y-4">
                {popularFields.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Aucun terrain disponible</p>
                  </div>
                ) : (
                  popularFields.map((field, index) => (
                    <Link href={`/fields/${field._id}`} key={index}>
                      <div className="group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden mr-4">
                          {field.sportType === 'football' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                            </svg>
                          )}
                          {field.sportType === 'basketball' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                              <path d="M4.93 4.93 19.07 19.07M12 2v20M22 12H2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                          )}
                          {(field.sportType === 'tennis' || field.sportType === 'padel') && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                              <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeWidth="2" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{field.name}</h3>
                          <p className="text-sm text-gray-500">{field.location}</p>
                          <p className="text-sm font-medium text-blue-600 mt-1">{field.pricePerHour}€/h</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
                
                <div className="pt-2">
                  <Link href="/fields" className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-center rounded-md text-gray-800 text-sm font-medium transition-colors">
                    Explorer tous les terrains
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions rapides */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/fields" className="group block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Nouvelle réservation</h3>
                <p className="text-sm text-gray-500 mt-2">Réservez un nouveau terrain sportif</p>
              </div>
            </Link>
            <Link href="/dashboard/bookings" className="group block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 group-hover:text-green-600 transition-colors">Mes réservations</h3>
                <p className="text-sm text-gray-500 mt-2">Consultez et gérez vos réservations</p>
              </div>
            </Link>
            <div className="group block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 group-hover:text-purple-600 transition-colors">Profil</h3>
                <p className="text-sm text-gray-500 mt-2">Modifiez vos informations personnelles</p>
              </div>
            </div>
            <div className="group block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 group-hover:text-orange-600 transition-colors">Aide</h3>
                <p className="text-sm text-gray-500 mt-2">Consultez notre centre d'aide et de support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}