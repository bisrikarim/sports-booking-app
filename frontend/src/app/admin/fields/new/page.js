'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createField } from '@/services/fields';

export default function NewFieldPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    sportType: 'football',
    location: '',
    pricePerHour: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pricePerHour' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createField(formData);
      alert('Terrain créé avec succès!');
      router.push('/admin/fields');
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau terrain</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-2">Nom du terrain</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Type de sport</label>
          <select
            name="sportType"
            value={formData.sportType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="tennis">Tennis</option>
            <option value="padel">Padel</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Localisation</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Prix par heure (€)</label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
          />
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
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-400"
          >
            {loading ? 'En cours...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}