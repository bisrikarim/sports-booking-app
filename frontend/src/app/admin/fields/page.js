// src/app/admin/fields/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllFields, deleteField } from '@/services/fields';
import Link from 'next/link';

export default function AdminFieldsPage() {
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const fetchFields = async () => {
    try {
      setLoading(true);
      const data = await getAllFields();
      setFields(data);
    } catch (err) {
      setError("Erreur lors du chargement des terrains");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleDeleteField = async (fieldId, fieldName) => {
    // Confirmation de suppression
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le terrain "${fieldName}" ?`)) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteField(fieldId);
      // Recharger la liste des terrains
      await fetchFields();
    } catch (err) {
      alert(`Erreur lors de la suppression: ${err.message}`);
      console.error('Erreur de suppression:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtrer les terrains
  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          field.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? field.sportType === selectedType : true;
    return matchesSearch && matchesType;
  });

  // Fonction pour obtenir la couleur de fond selon le type de sport
  const getSportTypeColor = (type) => {
    switch(type) {
      case 'football': return 'bg-green-100 text-green-800';
      case 'basketball': return 'bg-orange-100 text-orange-800';
      case 'tennis': return 'bg-yellow-100 text-yellow-800';
      case 'padel': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Fonction pour obtenir l'icône selon le type de sport
  const getSportTypeIcon = (type) => {
    switch(type) {
      case 'football':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
            <path d="M12 2v4m0 16v-4m10-8h-4M6 12H2m17.5-5.5l-2.8 2.8M7.3 16.7l-2.8 2.8M19.7 16.7l-2.8-2.8M7.3 7.3L4.5 4.5" strokeLinecap="round" strokeWidth="1.5"/>
          </svg>
        );
      case 'basketball':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
            <path strokeLinecap="round" strokeWidth="1.5" d="M4.93 4.93L19.07 19.07M12 2v20M22 12H2"/>
          </svg>
        );
      case 'tennis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
            <path d="M18 3.5C16 8 16 16 18 20.5M6 3.5C8 8 8 16 6 20.5" strokeWidth="1.5"/>
          </svg>
        );
      case 'padel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5"/>
            <line x1="5" y1="12" x2="19" y2="12" strokeWidth="1.5"/>
            <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestion des terrains</h1>
            <p className="text-gray-500">Ajoutez, modifiez ou supprimez des terrains sportifs</p>
          </div>
          <Link 
            href="/admin/fields/new" 
            className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Ajouter un terrain
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recherche */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Rechercher</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom ou lieu"
                    className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                </div>
              </div>
              
              {/* Type de sport */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Type de sport</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                >
                  <option value="">Tous les types</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="padel">Padel</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Carte des terrains */}
        {filteredFields.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-8h-3v8M7 21v-6h3v6M7 12h.01M17 8h.01" />
            </svg>
            <h3 className="text-gray-800 text-xl font-semibold mb-2">Aucun terrain trouvé</h3>
            <p className="text-gray-500 mb-6">Modifiez vos critères de recherche ou ajoutez un nouveau terrain</p>
            <Link
              href="/admin/fields/new"
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Ajouter un terrain
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFields.map((field) => (
              <div 
                key={field._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{field.name}</h3>
                    <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSportTypeColor(field.sportType)}`}>
                      {getSportTypeIcon(field.sportType)}
                      {field.sportType.charAt(0).toUpperCase() + field.sportType.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{field.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-black">{field.pricePerHour}€/heure</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Link 
                      href={`/admin/fields/edit/${field._id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </Link>
                    
                    <button 
                      onClick={() => handleDeleteField(field._id, field.name)}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}