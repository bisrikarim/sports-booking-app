// src/app/dashboard/layout.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/auth';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protection de la route - rediriger vers login si non authentifié
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Chargement...</div>;
  }

  return children;
}