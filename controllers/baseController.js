const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav, description: "Welcome to the home page of CSE Motors."})
}

/* ***************************
 * Trigger an intentional error
 * ************************** */
baseController.triggerError = async function(req, res, next) {
    // This will cause a server error
    const err = new Error("This is an intentional error for testing purposes.")
    err.status = 500; // Set the status code to 500
    throw err;
}
module.exports = baseController