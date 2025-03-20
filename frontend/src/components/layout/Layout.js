import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} SportReserve - Tous droits réservés
        </div>
      </footer>
    </div>
  );
}   