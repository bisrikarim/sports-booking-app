const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validations/authValidation');
const { validate } = require('../middlewares/validationMiddleware');

router.post('/register', validateRegister, validate, authController.register);
router.post('/login', validateLogin, validate, authController.login);

module.exports = router;