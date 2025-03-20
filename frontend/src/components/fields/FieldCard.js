import Link from 'next/link';

export default function FieldCard({ field }) {
  const fieldId = field._id || field.id;
  
  // URL de l'image avec gestion de l'image par défaut
  const imageUrl = field.image 
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/fields/${field.image}`
    : `/images/${field.sportType}-default.jpg`;

  // Styles dynamiques par type de sport
  const sportStyles = {
    football: { bg: 'bg-green-100', text: 'text-green-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    )},
    basketball: { bg: 'bg-orange-100', text: 'text-orange-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
        <path strokeLinecap="round" strokeWidth="1.5" d="M4.93 4.93L19.07 19.07M12 2v20M22 12H2"/>
      </svg>
    )},
    tennis: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
        <path d="M18 3.5C16 8 16 16 18 20.5M6 3.5C8 8 8 16 6 20.5" strokeWidth="1.5"/>
      </svg>
    )},
    padel: { bg: 'bg-purple-100', text: 'text-purple-800', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5"/>
        <line x1="5" y1="12" x2="19" y2="12" strokeWidth="1.5"/>
        <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5"/>
      </svg>
    )}
  };

  const sportStyle = sportStyles[field.sportType] || { bg: 'bg-blue-100', text: 'text-blue-800' };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      {/* Image du terrain */}
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={field.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800">{field.name}</h3>
          
          {/* Badge du type de sport */}
          <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${sportStyle.bg} ${sportStyle.text}`}>
            {sportStyle.icon && <span className="mr-1">{sportStyle.icon}</span>}
            {field.sportType.charAt(0).toUpperCase() + field.sportType.slice(1)}
          </span>
        </div>

        {/* Informations du terrain */}
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

        {/* Bouton de détails */}
        {fieldId ? (
          <Link href={`/fields/${fieldId}`}>
            <div className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md font-medium transition-colors cursor-pointer">
              Voir le terrain
            </div>
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
}