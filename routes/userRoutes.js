const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userControllers");
const password = require('../middleware/password-validator'); 
const email = require('../middleware/email.middleware');
const connexion = require('../middleware/connexion.middleware'); 

router.post("/signup", password, email, userCtrl.signup);
router.post('/login', connexion, userCtrl.login);
router.get("/:id", userCtrl.getUser)

module.exports = router;
