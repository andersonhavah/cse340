const utilities = require("../utilities")
const baseController = {}

/* ************************* 
* Build Home view with MVC
* *************************** */
baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav, description: "Welcome to the home page of CSE Motors."})
}

module.exports = baseController