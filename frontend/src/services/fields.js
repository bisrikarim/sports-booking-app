// src/services/fields.js
import api from './api';

export const getAllFields = async () => {
  try {
    console.log('Tentative de récupération des terrains...');
    
    // Utiliser fetch directement pour déboguer
    const response = await fetch('http://localhost:3001/api/fields');
    console.log('Status de la réponse:', response.status);
    
    const data = await response.json();
    console.log('Données reçues:', data);
    
    return data; // Retourner directement les données
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des terrains:', error);
    throw error;
  }
};

export const getFieldById = async (id) => {
  try {
    console.log('Tentative de récupération du terrain:', id);
    
    // Utiliser fetch directement pour déboguer
    const response = await fetch(`http://localhost:3001/api/fields/${id}`);
    console.log('Status de la réponse:', response.status);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Données reçues:', data);
    
    return data;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw error;
  }
};

export const getFieldsByType = async (sportType) => {
  try {
    const response = await api.get(`/fields?sportType=${sportType}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des terrains de type ${sportType}:`, error);
    throw error;
  }
};

export const createField = async (fieldData) => {
  try {
      const response = await api.post('/fields', fieldData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
  } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
  }
};

export const updateField = async (fieldId, fieldData) => {
  try {
    console.log('Tentative de modification du terrain:', fieldId);
    console.log('Nouvelles données:', fieldData);
    const response = await api.put(`/fields/${fieldId}`, fieldData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la modification du terrain:', error);
    throw error;
  }
};

export const deleteField = async (fieldId) => {
  try {
    console.log('Tentative de suppression du terrain:', fieldId);
    const response = await api.delete(`/fields/${fieldId}`);
    return response;
  } catch (error) {
    console.error('Erreur lors de la suppression du terrain:', error);
    throw error;
  }
};