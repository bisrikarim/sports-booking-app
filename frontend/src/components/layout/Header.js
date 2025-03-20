// src/components/layout/Header.js
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, isAdmin, logout } from '@/services/auth';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Vérification initiale
      setIsLoggedIn(isAuthenticated());
      setIsAdminUser(isAdmin());
      
      // Écouter les changements d'authentification
      const handleAuthChange = () => {
        setIsLoggedIn(isAuthenticated());
        setIsAdminUser(isAdmin());
      };
      
      window.addEventListener('auth-change', handleAuthChange);
      
      // Pour plus de robustesse, vérifier périodiquement
      const interval = setInterval(() => {
        setIsLoggedIn(isAuthenticated());
        setIsAdminUser(isAdmin());
      }, 1000);
      
      return () => {
        window.removeEventListener('auth-change', handleAuthChange);
        clearInterval(interval);
      };
    }
  }, []);
  
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsAdminUser(false);
    router.push('/login');
  };
  
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight">SportReserve</span>
            </Link>
            
            {/* Navigation principale - version desktop */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/" 
                className="px-3 py-2 text-sm font-medium hover:text-gray-200 transition-colors relative group"
              >
                Accueil
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link 
                href="/fields" 
                className="px-3 py-2 text-sm font-medium hover:text-gray-200 transition-colors relative group"
              >
                Terrains
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              {isLoggedIn && (
                <Link 
                  href="/dashboard" 
                  className="px-3 py-2 text-sm font-medium hover:text-gray-200 transition-colors relative group"
                >
                  Tableau de bord
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              )}
              {isAdminUser && (
                <div className="relative group">
                  <button className="px-3 py-2 text-sm font-medium hover:text-gray-200 transition-colors flex items-center gap-1 relative">
                    Administration
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                  
                  {/* Menu déroulant admin */}
                  <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100">
                    <div className="py-1">
                      <Link href="/admin/fields" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Gestion des terrains
                      </Link>
                      <Link href="/admin/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Gestion des réservations
                      </Link>
                      <Link href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Gestion des utilisateurs
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
          
          {/* Boutons de droite */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard/bookings"
                  className="text-sm font-medium flex items-center gap-1 hover:text-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Mes réservations
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-white rounded-md text-sm font-medium hover:bg-white hover:text-black transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v1a1 1 0 102 0V9z" clipRule="evenodd" />
                    <path d="M17 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6M3 3h18" />
                  </svg>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-gray-200 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
          
          {/* Menu mobile - bouton hamburger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-4 pt-2 pb-3">
          <Link
            href="/"
            className="block px-3 py-2 text-base font-medium hover:bg-gray-800 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            href="/fields"
            className="block px-3 py-2 text-base font-medium hover:bg-gray-800 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Terrains
          </Link>
          
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tableau de bord
            </Link>
          )}
          
          {isAdminUser && (
            <>
              <div className="px-3 py-2 text-base font-medium text-gray-400">Administration</div>
              <Link
                href="/admin/fields"
                className="block px-3 py-2 pl-6 text-base font-medium hover:bg-gray-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gestion des terrains
              </Link>
              <Link
                href="/admin/bookings"
                className="block px-3 py-2 pl-6 text-base font-medium hover:bg-gray-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gestion des réservations
              </Link>
              <Link
                href="/admin/users"
                className="block px-3 py-2 pl-6 text-base font-medium hover:bg-gray-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gestion des utilisateurs
              </Link>
            </>
          )}
          
          {isLoggedIn ? (
            <>
              <div className="border-t border-gray-700 pt-2 mt-2"></div>
              <Link
                href="/dashboard/bookings"
                className="block px-3 py-2 text-base font-medium hover:bg-gray-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mes réservations
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-gray-800 rounded-md"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-700 pt-2 mt-2"></div>
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium hover:bg-gray-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 text-base font-medium bg-white text-black hover:bg-gray-200 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}