import './globals.css';
import Layout from '@/components/layout/Layout';

export const metadata = {
  title: 'SportReserve - Réservation de terrains sportifs',
  description: 'Plateforme de réservation de terrains sportifs en ligne',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}