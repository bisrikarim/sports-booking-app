// src/app/fields/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFieldById } from '@/services/fields';
import { isAuthenticated } from '@/services/auth';

export default function FieldDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la réservation
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([]);

  // Créneaux horaires simulés - à remplacer par des données de l'API
  const availableTimeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', 
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  useEffect(() => {
    const fetchFieldData = async () => {
      try {
        // Charger les données du terrain
        const fieldData = await getFieldById(id);
        setField(fieldData);
        
        // Générer des créneaux horaires simulés
        generateTimeSlots(selectedDate);
      } catch (err) {
        console.error("Erreur lors du chargement du terrain:", err);
        setError("Impossible de charger les détails du terrain");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFieldData();
    }
  }, [id]);

  // Fonction pour générer des créneaux horaires disponibles
  const generateTimeSlots = (date) => {
    // Ici, vous feriez normalement un appel API pour obtenir les créneaux réellement disponibles
    // Pour l'instant, nous simulons des créneaux disponibles de manière aléatoire
    setTimeSlots(availableTimeSlots.map(slot => ({
      slot,
      available: Math.random() > 0.3 // Simuler des créneaux déjà réservés
    })));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    generateTimeSlots(newDate);
  };

  const handleReservation = (timeSlot) => {
    if (!isAuthenticated()) {
      alert('Veuillez vous connecter pour réserver un terrain.');
      router.push('/login');
      return;
    }
    
    // Rediriger vers la page de confirmation de réservation
    router.push(`/bookings/new?field=${id}&date=${selectedDate}&timeSlot=${timeSlot}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement des détails...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!field) {
    return <div className="flex justify-center items-center min-h-screen">Terrain non trouvé</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Information du terrain */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-4">{field.name}</h1>
        <p className="mb-2">{field.location}</p>
        <p className="mb-2">Type: {field.sportType}</p>
        <p className="mb-2">Prix: {field.pricePerHour}€/heure</p>
      </div>
      
      {/* Section de réservation */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Réserver ce terrain</h2>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Sélectionnez une date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">
            Créneaux disponibles
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {timeSlots.map(({ slot, available }) => (
              <button
                key={slot}
                onClick={() => available && handleReservation(slot)}
                disabled={!available}
                className={`p-2 border rounded-md ${
                  available 
                    ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' 
                    : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm italic">
            Cliquez sur un créneau disponible pour effectuer une réservation
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => router.back()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Retour
      </button>
    </div>
  );
}