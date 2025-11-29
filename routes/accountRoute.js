// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Route to build the Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;
