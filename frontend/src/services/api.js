import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    // Ajoutons un log pour vérifier si le token est récupéré
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Ajout du token à la requête:', token.substring(0, 15) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Aucun token trouvé dans localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Méthodes d'API pour faciliter les appels
const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    console.error(`Erreur GET ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

const post = async (url, data = {}, config = {}) => {
  try {
    console.log(`POST ${url} - Données:`, data);
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`Erreur POST ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`Erreur PUT ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    console.error(`Erreur DELETE ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

export default {
  get,
  post,
  put,
  delete: del
};