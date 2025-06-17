// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const baseController = require("../controllers/baseController")

// Route to trigger a 500 server error
router.get("/trigger-error", utilities.handleErrors(baseController.triggerError));