// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation")

// Route to build the Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process the Registration
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Route to process the Login attempt
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount))

module.exports = router;
