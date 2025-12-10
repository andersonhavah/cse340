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
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Route to process the Login attempt
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

// Deliver Account Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to build update account view
router.get("/update/:id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Route to process account update
router.post("/update", 
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateUserData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to process password change
router.post("/change-password",
  utilities.checkLogin,
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;
