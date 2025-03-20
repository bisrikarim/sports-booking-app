'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFieldById, updateField } from '@/services/fields';

export default function EditFieldPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    location: '',
    pricePerHour: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        const field = await getFieldById(id);
        setFormData({
          name: field.name || '',
          sportType: field.sportType || 'football',
          location: field.location || '',
          pricePerHour: field.pricePerHour || ''
        });
      } catch (err) {
        console.error('Erreur lors du chargement du terrain:', err);
        setError('Impossible de charger les données du terrain');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchField();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pricePerHour' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateField(id, formData);
      alert('Terrain modifié avec succès!');
      router.push('/admin/fields');
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
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
      <h1 className="text-2xl font-bold mb-6">Modifier le terrain</h1>
      
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
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400"
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}