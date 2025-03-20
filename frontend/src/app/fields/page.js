// src/app/fields/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllFields, getFieldsByType } from '@/services/fields';
import Link from 'next/link';

// Composant de carte de terrain amélioré
const FieldCard = ({ field }) => {
  const fieldId = field._id || field.id;
  
  // Définir les couleurs pour les différents types de sport
  const sportColors = {
    football: { bg: 'bg-green-100', text: 'text-green-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v4m0 16v-4m10-8h-4M6 12H2m17.5-5.5l-2.8 2.8M7.3 16.7l-2.8 2.8M19.7 16.7l-2.8-2.8M7.3 7.3L4.5 4.5"/>
      </svg>
    )},
    basketball: { bg: 'bg-orange-100', text: 'text-orange-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
        <path strokeLinecap="round" strokeWidth="1.5" d="M4.93 4.93L19.07 19.07M12 2v20M22 12H2"/>
      </svg>
    )},
    tennis: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
        <path d="M18 3.5C16 8 16 16 18 20.5M6 3.5C8 8 8 16 6 20.5" strokeWidth="1.5"/>
      </svg>
    )},
    padel: { bg: 'bg-purple-100', text: 'text-purple-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5"/>
        <line x1="5" y1="12" x2="19" y2="12" strokeWidth="1.5"/>
        <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5"/>
      </svg>
    )}
  };
  
  // Utiliser les couleurs du type de sport ou des valeurs par défaut
  const sportStyle = sportColors[field.sportType] || { bg: 'bg-blue-100', text: 'text-blue-800' };
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">{field.name}</h3>
          <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${sportStyle.bg} ${sportStyle.text}`}>
            {sportStyle.icon && <span className="mr-1">{sportStyle.icon}</span>}
            {field.sportType.charAt(0).toUpperCase() + field.sportType.slice(1)}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center text-gray-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{field.location}</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{field.pricePerHour}€/heure</span>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        {fieldId ? (
          <Link href={`/fields/${fieldId}`} className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md font-medium transition-colors">
            Voir le terrain
          </Link>
        ) : (
          <button
            onClick={() => alert("Impossible d'afficher les détails: ID du terrain manquant")}
            className="block w-full py-2 px-4 bg-gray-400 text-white text-center rounded-md font-medium cursor-not-allowed"
          >
            Non disponible
          </button>
        )}
      </div>
    </div>
  );
};

// Composant de filtre amélioré
const FieldFilter = ({ onFilterChange, filters, sportTypeCounts, priceRange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      sportType: '',
      priceMax: '',
      searchTerm: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Filtrer les terrains</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Type de sport avec compteurs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de sport
          </label>
          <div className="space-y-2">
            <div 
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer border ${
                localFilters.sportType === '' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'sportType', value: '' } })}
            >
              <span className="font-medium">Tous les sports</span>
              <span className="text-sm text-gray-500">{sportTypeCounts.total || 0}</span>
            </div>
            
            <div 
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer border ${
                localFilters.sportType === 'football' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'sportType', value: 'football' } })}
            >
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-3"></span>
                <span className="font-medium">Football</span>
              </div>
              <span className="text-sm text-gray-500">{sportTypeCounts.football || 0}</span>
            </div>
            
            <div 
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer border ${
                localFilters.sportType === 'basketball' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'sportType', value: 'basketball' } })}
            >
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-orange-500 mr-3"></span>
                <span className="font-medium">Basketball</span>
              </div>
              <span className="text-sm text-gray-500">{sportTypeCounts.basketball || 0}</span>
            </div>
            
            <div 
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer border ${
                localFilters.sportType === 'tennis' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'sportType', value: 'tennis' } })}
            >
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-yellow-500 mr-3"></span>
                <span className="font-medium">Tennis</span>
              </div>
              <span className="text-sm text-gray-500">{sportTypeCounts.tennis || 0}</span>
            </div>
            
            <div 
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer border ${
                localFilters.sportType === 'padel' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'sportType', value: 'padel' } })}
            >
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-purple-500 mr-3"></span>
                <span className="font-medium">Padel</span>
              </div>
              <span className="text-sm text-gray-500">{sportTypeCounts.padel || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Prix et recherche */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix maximum (€/h)
            </label>
            <div className="space-y-2">
              <input
                type="range"
                name="priceMax"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceMax || priceRange.max}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{priceRange.min}€</span>
                <span>{localFilters.priceMax || priceRange.max}€</span>
                <span>{priceRange.max}€</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="searchTerm"
                value={localFilters.searchTerm}
                onChange={handleChange}
                placeholder="Rechercher par nom ou lieu"
                className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal qui utilise useSearchParams
function FieldsContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams?.get('type') || '';
  
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sportType: initialType,
    priceMax: '',
    searchTerm: ''
  });
  
  // Statistiques pour les filtres
  const [sportTypeCounts, setSportTypeCounts] = useState({
    total: 0,
    football: 0,
    basketball: 0,
    tennis: 0,
    padel: 0
  });
  
  // Prix min et max pour le slider
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 100
  });

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        
        let data;
        if (initialType) {
          data = await getFieldsByType(initialType);
        } else {
          data = await getAllFields();
        }
        
        if (data) {
          // Normaliser les données
          const fieldsArray = Array.isArray(data) ? data : 
                            (data._id ? [data] : 
                            Object.values(data).find(val => Array.isArray(val)) || []);
          
          setFields(fieldsArray);
          setFilteredFields(fieldsArray);
          
          // Calculer les statistiques
          const counts = { total: fieldsArray.length };
          const prices = [];
          
          fieldsArray.forEach(field => {
            // Compter par type de sport
            const type = field.sportType;
            counts[type] = (counts[type] || 0) + 1;
            
            // Collecter les prix pour trouver min/max
            if (field.pricePerHour) {
              prices.push(field.pricePerHour);
            }
          });
          
          setSportTypeCounts(counts);
          
          // Trouver min et max prix
          if (prices.length > 0) {
            setPriceRange({
              min: Math.floor(Math.min(...prices)),
              max: Math.ceil(Math.max(...prices))
            });
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des terrains:', err);
        setError('Erreur lors du chargement des terrains. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [initialType]);

  useEffect(() => {
    if (!fields || fields.length === 0) return;
    
    // Filtrer les terrains selon les critères sélectionnés
    let result = [...fields];
    
    if (filters.sportType) {
      result = result.filter(field => field.sportType === filters.sportType);
    }
    
    if (filters.priceMax && !isNaN(filters.priceMax) && filters.priceMax > 0) {
      result = result.filter(field => field.pricePerHour <= parseFloat(filters.priceMax));
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(field => 
        (field.name?.toLowerCase() || '').includes(searchLower) || 
        (field.location?.toLowerCase() || '').includes(searchLower)
      );
    }
    
    setFilteredFields(result);
  }, [fields, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête de page */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explorez nos terrains sportifs</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez et réservez le terrain idéal pour votre activité sportive préférée
          </p>
        </div>
        
        {/* Filtres */}
        <FieldFilter 
          onFilterChange={handleFilterChange} 
          filters={filters} 
          sportTypeCounts={sportTypeCounts}
          priceRange={priceRange}
        />
        
        {/* Résultats */}
        {filteredFields.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17v.01M12 13a1 1 0 010-2V8" />
            </svg>
            <h3 className="text-gray-800 text-xl font-bold mb-2">Aucun terrain ne correspond à vos critères</h3>
            <p className="text-gray-500 mb-6">Essayez de modifier vos filtres ou d'élargir votre recherche</p>
            <button
              onClick={handleFilterChange.bind(null, { sportType: '', priceMax: '', searchTerm: '' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">{filteredFields.length} terrain(s) trouvé(s)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFields.map((field, index) => (
                <FieldCard key={field._id || index} field={field} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Composant principal qui encapsule le contenu dans Suspense
export default function FieldsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <FieldsContent />
    </Suspense>
  );
}