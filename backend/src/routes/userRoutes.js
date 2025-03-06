const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes pour les utilisateurs (Users)
router.post('/', userController.createUser); // Ajouter un utilisateur
router.get('/', userController.getUsers); // Récupérer tous les utilisateurs
router.get('/:id', userController.getUserById); // Récupérer un utilisateur par ID
router.put('/:id', userController.updateUser); // Modifier un utilisateur
router.delete('/:id', userController.deleteUser); // Supprimer un utilisateur

module.exports = router;
