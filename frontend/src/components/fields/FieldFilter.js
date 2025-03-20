// src/components/fields/FieldFilter.js
'use client';

import { useState } from 'react';

export default function FieldFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    sportType: '',
    priceMax: '',
    searchTerm: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      sportType: '',
      priceMax: '',
      searchTerm: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filtrer les terrains</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de sport
          </label>
          <select
            name="sportType"
            value={filters.sportType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les sports</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="padel">Padel</option>
            <option value="tennis">Tennis</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix maximum (€/h)
          </label>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleChange}
            placeholder="Prix max"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recherche
          </label>
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleChange}
            placeholder="Nom ou lieu"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}