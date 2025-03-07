# 🏟️ Sports Booking App

## 📌 Description
**Sports Booking App** est une application web permettant la gestion des réservations de terrains de sport. Les utilisateurs peuvent réserver des créneaux horaires pour des terrains spécifiques, tandis que les administrateurs peuvent gérer les terrains et les réservations.

---

## 🚀 Fonctionnalités
### ✅ **Pour les utilisateurs**
- 🔹 Créer un compte et s'authentifier.
- 🔹 Consulter la liste des terrains disponibles.
- 🔹 Réserver un terrain à une date et un créneau précis.
- 🔹 Voir l'historique de ses réservations.
- 🔹 Annuler une réservation (si non confirmée et plus de 24h avant l'horaire prévu).

### ✅ **Pour les administrateurs**
- 🔹 Ajouter, modifier et supprimer des terrains.
- 🔹 Voir toutes les réservations de tous les utilisateurs.
- 🔹 Confirmer une réservation.
- 🔹 Annuler n'importe quelle réservation.
- 🔹 Supprimer une réservation.

---

## ⚙️ Technologies utilisées
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JSON Web Token (JWT)
- **Déploiement** : Docker (environnement de développement)

---

## 📂 Installation et exécution

### 1️⃣ **Cloner le projet**
```bash
git clone https://github.com/ton-repo/sports-booking-app.git
cd sports-booking-app
```

### 2️⃣ **Installer les dépendances**
```bash
npm install
```

### 3️⃣ **Configurer les variables d'environnement**
Créer un fichier `.env` à la racine du projet et ajouter :
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/sports-booking
JWT_SECRET=your_secret_key
```

### 4️⃣ **Démarrer l'application**
```bash
npm start
```
L'API sera accessible sur `http://localhost:3001`

---

## 📝 API Endpoints

### 🔹 **Authentification**
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/register` | Créer un compte utilisateur |
| `POST` | `/api/auth/login` | Se connecter |

### 🔹 **Gestion des terrains** (Admin uniquement)
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/fields` | Ajouter un terrain |
| `GET` | `/api/fields` | Voir tous les terrains |
| `GET` | `/api/fields/:id` | Voir un terrain spécifique |
| `PUT` | `/api/fields/:id` | Modifier un terrain |
| `DELETE` | `/api/fields/:id` | Supprimer un terrain |

### 🔹 **Gestion des réservations**
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/bookings` | Réserver un terrain (Utilisateur uniquement) |
| `GET` | `/api/bookings` | Voir les réservations (toutes pour admin, uniquement les siennes pour user) |
| `GET` | `/api/bookings/:id` | Voir une réservation spécifique |
| `PUT` | `/api/bookings/:id/confirm` | Confirmer une réservation (Admin uniquement) |
| `PUT` | `/api/bookings/:id/cancel` | Annuler une réservation (User/Admin) |
| `DELETE` | `/api/bookings/:id` | Supprimer une réservation (Admin uniquement) |

---

## 🛠 Tests avec `cURL`

### 🔹 **Créer un utilisateur**
```bash
curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name": "Karim", "email": "karim@example.com", "password": "mypassword" }'
```

### 🔹 **Se connecter**
```bash
curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "karim@example.com", "password": "mypassword" }'
```
Le retour contient un `token`, à utiliser pour les requêtes suivantes.

### 🔹 **Réserver un terrain**
```bash
curl -X POST http://localhost:3001/api/bookings \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer VOTRE_TOKEN" \
     -d '{ "field": "ID_DU_TERRAIN", "date": "2025-03-09T14:00:00.000Z", "timeSlot": "14:00-15:00" }'
```

### 🔹 **Voir ses réservations**
```bash
curl -X GET http://localhost:3001/api/bookings \
     -H "Authorization: Bearer VOTRE_TOKEN"
```

### 🔹 **Confirmer une réservation (Admin)**
```bash
curl -X PUT http://localhost:3001/api/bookings/ID_RESERVATION/confirm \
     -H "Authorization: Bearer TOKEN_ADMIN"
```

### 🔹 **Annuler une réservation**
```bash
curl -X PUT http://localhost:3001/api/bookings/ID_RESERVATION/cancel \
     -H "Authorization: Bearer VOTRE_TOKEN"
```

### 🔹 **Supprimer une réservation (Admin)**
```bash
curl -X DELETE http://localhost:3001/api/bookings/ID_RESERVATION \
     -H "Authorization: Bearer TOKEN_ADMIN"
```

---

## 🎯 Contribution
💡 **Vous souhaitez contribuer ?**
1. **Forkez** le repo.
2. **Clonez** votre fork.
3. **Créez** une branche avec votre feature.
4. **Faites** un `pull request`.
5. **Participez** en ouvrant des issues pour suggérer des améliorations !

📌 **Repo GitHub** : [Lien du projet](https://github.com/ton-repo/sports-booking-app)

---

## 📌 Auteurs
- 👤 **Karim** - Développeur principal

🚀 **Merci de tester l'application et d'apporter vos suggestions !**
