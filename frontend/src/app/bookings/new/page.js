'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFieldById } from '@/services/fields';
import { isAuthenticated } from '@/services/auth';

function NewBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const fieldId = searchParams.get('field');
  const date = searchParams.get('date');
  const timeSlot = searchParams.get('timeSlot');
  
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingBooking, setConfirmingBooking] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Vérifier si tous les paramètres nécessaires sont présents
    if (!fieldId || !date || !timeSlot) {
      setError('Informations de réservation incomplètes');
      setLoading(false);
      return;
    }

    const fetchFieldData = async () => {
      try {
        const data = await getFieldById(fieldId);
        console.log("Données du terrain récupérées:", data);
        setField(data);
      } catch (err) {
        console.error("Erreur lors de la récupération du terrain:", err);
        
        // Données simulées en cas d'erreur
        const fallbackField = {
          _id: fieldId,
          name: "Terrain " + fieldId.substring(0, 5),
          location: "Stade Municipal",
          sportType: "football",
          pricePerHour: 50
        };
        
        console.log("Utilisation de données simulées:", fallbackField);
        setField(fallbackField);
        setError('Données simulées - Impossible de se connecter à l\'API');
      } finally {
        setLoading(false);
      }
    };

    fetchFieldData();
  }, [fieldId, date, timeSlot, router]);

  const handleConfirmBooking = async () => {
    try {
      setConfirmingBooking(true);
      
      // Formatage de la date pour s'assurer qu'elle est au format YYYY-MM-DD
      const formattedDate = date ? new Date(date).toISOString().split('T')[0] : date;
      
      const bookingData = {
        field: fieldId,
        date: formattedDate,
        timeSlot: timeSlot
      };
      
      console.log('Tentative de réservation avec:', bookingData);
      
      // Utiliser fetch directement pour plus de contrôle
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      console.log('URL de l\'API:', API_URL);
      console.log('Token disponible:', !!token);
      if (token) {
        console.log('Début du token:', token.substring(0, 20) + '...');
      }
      
      if (!token) {
        throw new Error('Vous devez être connecté pour effectuer une réservation');
      }
      
      console.log('Envoi de la requête...');
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });
      
      console.log('Statut de la réponse:', response.status);
      console.log('Headers de la réponse:', Object.fromEntries([...response.headers]));
      
      const data = await response.json();
      console.log('Données de la réponse:', data);
      
      if (!response.ok) {
        console.log('Erreur détectée, analyse...');
        console.log('Données brutes de la réponse:', data);
        console.log('Details si disponibles:', data.details);
        
        let errorMessage = 'Erreur lors de la réservation';
        
        if (data.details && Array.isArray(data.details)) {
          // Format spécifique pour express-validator
          errorMessage = data.details.map(d => `${d.path}: ${d.msg}`).join(', ');
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        throw new Error(errorMessage);
      }
      
      alert('Réservation confirmée avec succès!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Erreur détaillée:', err);
      
      // Essayer de récupérer tous les détails possibles
      let errorMessage = err.message || 'Problème lors de la réservation';
      
      // Vérifier si nous avons plus de détails
      if (err.response) {
        try {
          const errorData = await err.response.json();
          errorMessage += ': ' + (errorData.error || errorData.message || JSON.stringify(errorData));
        } catch (parseErr) {
          console.error('Impossible de parser la réponse d\'erreur:', parseErr);
        }
      }
      
      setError(errorMessage);
      alert('Erreur: ' + errorMessage);
      setConfirmingBooking(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (err) {
      console.error('Erreur lors du formatage de la date:', err);
      return dateString; // Retourner la date brute en cas d'erreur
    }
  };

  // Fonction test pour debug
  const testBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Pas de token trouvé. Veuillez vous connecter.');
        return;
      }
      
      const testData = {
        field: fieldId,
        date: "2025-03-20",
        timeSlot: "14:00-15:00"
      };
      
      console.log('Test de réservation avec:', testData);
      console.log('Token utilisé:', token.substring(0, 20) + '...');
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Statut du test:', response.status);
      const data = await response.json();
      console.log('Réponse du test:', data);
      
      alert('Test réussi! Voir console pour détails.');
    } catch (err) {
      console.error('Erreur test:', err);
      alert('Erreur test: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Préparation de votre réservation...
      </div>
    );
  }

  if (error && !field) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          backgroundColor: '#FEF2F2', 
          color: '#B91C1C', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error || "Impossible de charger les détails de la réservation"}
        </div>
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {error && (
        <div style={{ 
          backgroundColor: '#FEF2F2', 
          color: '#B91C1C', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Confirmer votre réservation
        </h1>
        
        <div style={{ 
          borderBottom: '1px solid #e5e7eb', 
          paddingBottom: '20px', 
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
            Résumé de la réservation
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Terrain:</div>
            <div>{field.name}</div>
            
            <div style={{ fontWeight: 'bold' }}>Type de sport:</div>
            <div>{field.sportType}</div>
            
            <div style={{ fontWeight: 'bold' }}>Date:</div>
            <div>{formatDate(date)}</div>
            
            <div style={{ fontWeight: 'bold' }}>Créneau horaire:</div>
            <div>{timeSlot}</div>
            
            <div style={{ fontWeight: 'bold' }}>Prix:</div>
            <div>{field.pricePerHour}€</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
          
          <button
            onClick={testBooking}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9333ea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Réservation
          </button>
          
          <button
            onClick={handleConfirmBooking}
            disabled={confirmingBooking}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: confirmingBooking ? 'not-allowed' : 'pointer'
            }}
          >
            {confirmingBooking ? 'Confirmation en cours...' : 'Confirmer la réservation'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>}>
      <NewBookingContent />
    </Suspense>
  );
}