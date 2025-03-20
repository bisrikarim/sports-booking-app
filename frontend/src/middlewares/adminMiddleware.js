'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/auth';

// Fonction pour vérifier si l'utilisateur est admin
const getUserRole = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Décodez le token JWT pour vérifier le rôle
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle:', error);
    return null;
  }
};

export default function AdminMiddleware({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (role !== 'admin') {
      alert('Accès réservé aux administrateurs');
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Vérification des autorisations...</div>;
  }

  return children;
}