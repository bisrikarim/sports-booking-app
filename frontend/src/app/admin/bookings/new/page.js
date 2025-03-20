'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllFields } from '@/services/fields';
import { createBooking } from '@/services/bookings';

export default function NewAdminBookingPage() {
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    field: '',
    date: '',
    timeSlot: '',
    userId: '', // ID de l'utilisateur
    userEmail: '' // Email pour trouver l'utilisateur
  });

  // Créneaux horaires disponibles
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', 
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const fieldsData = await getAllFields();
        setFields(Array.isArray(fieldsData) ? fieldsData : []);
      } catch (err) {
        console.error('Erreur lors du chargement des terrains:', err);
        setError('Impossible de charger les terrains');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.field || !formData.date || !formData.timeSlot) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSaving(true);
      
      // Création de l'objet de réservation
      const bookingData = {
        field: formData.field,
        date: formData.date,
        timeSlot: formData.timeSlot
      };
      
      // Si un email est fourni, l'ajouter
      if (formData.userEmail) {
        bookingData.userEmail = formData.userEmail;
      }
      
      // Si un ID utilisateur est fourni, l'ajouter
      if (formData.userId) {
        bookingData.user = formData.userId;
      }
      
      await createBooking(bookingData);
      
      alert('Réservation créée avec succès!');
      router.push('/admin/bookings');
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle réservation</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-2">Terrain *</label>
          <select
            name="field"
            value={formData.field}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionnez un terrain</option>
            {fields.map(field => (
              <option key={field._id} value={field._id}>
                {field.name} - {field.location} ({field.sportType})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Créneau horaire *</label>
          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionnez un créneau</option>
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Email de l'utilisateur</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="email@exemple.com"
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            L'email de l'utilisateur pour qui vous créez la réservation
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">ID de l'utilisateur</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="ID MongoDB de l'utilisateur"
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            Facultatif si l'email est fourni. Format: 5f8d0e8e2a3b4c5d6e7f8g9h
          </p>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-400"
          >
            {saving ? 'Création en cours...' : 'Créer la réservation'}
          </button>
        </div>
      </form>
    </div>
  );
}