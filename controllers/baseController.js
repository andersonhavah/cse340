const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home Page", nav, description: "CSE Motors Home Page." });
}

module.exports = baseController;