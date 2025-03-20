import api from './api';

export const login = async (email, password) => {
  try {
    console.log('Tentative de connexion avec:', { email });
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    // Log du statut de la réponse
    console.log('Statut de la réponse:', response.status);

    // Log du contenu brut de la réponse
    const responseText = await response.text();
    console.log('Contenu brut de la réponse:', responseText);

    // Parsing manuel du JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      return { 
        success: false, 
        error: 'Réponse invalide du serveur' 
      };
    }

    console.log('Données parsées:', data);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('auth-change'));
      return { success: true };
    }
    
    return { 
      success: false, 
      error: data.error || 'Authentification échouée' 
    };
  } catch (error) {
    console.error('Erreur login:', error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de la connexion' 
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Erreur lors de l\'inscription' 
    };
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    // Déclencher un événement pour informer l'application du changement
    window.dispatchEvent(new Event('auth-change'));
  }
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem('token');
};

export const isAdmin = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle:', error);
    return false;
  }
};