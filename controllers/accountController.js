const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
// Import review model
const reviewModel = require("../models/review-model")

/* ******************************
*  Deliver login view
********************************* */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        description: "CSE Motors Login Page.",
        errors: null,
    });
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Registration",
        nav,
        description: "CSE Motors Registration Page",
        errors: null,
    });
};

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    let hashedPassword
    try {
        // Regular password and cost (salt is generated automatically)
        hashedPassword =  await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            description: "CSE MOTORS Registration Page",
            errors: null,
        })
    }
    
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered <strong>${account_firstname}</strong>. <br>Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      description: "CSE Motors Login Page.",
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      description: "CSE Motors Registration Page",
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      description: "CSE Motors Login Page",
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        description: "CSE Motors Login Page",
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
* Build Account Management View
* ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()

  // Get the account_id from the session (locals)
  const account_id = res.locals.accountData.account_id
  
  // GET THE REVIEWS from the database
  const reviews = await reviewModel.getReviewsByAccountId(account_id)
  // Add this line for testing:
  console.log("Reviews found:", reviews)
  
  res.render("account/management", {
    title: "Account Management",
    nav,
    description: "Account Management Page.",
    errors: null,
    reviews,
  })
}

/* ****************************************
 * Build Update Account View
 * ************************************ */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.id)
  const nav = await utilities.getNav()
  const data = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Edit Account",
    nav,
    description: "Account Update Page.",
    errors: null,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
  })
}

/* ****************************************
 * Process Update Account
 * ************************************ */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    
    // Regenerate the token with updated data so the header updates immediately
    delete updatedAccount.account_password
    const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }

    req.flash("notice", `The account information was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      description: "Account Update Page.",
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }
}

/* ****************************************
 * Process Change Password
 * ************************************ */
async function changePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password.')
    res.status(500).redirect("/account/")
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      description: "Account Update Page.",
      errors: null,
      account_firstname: req.body.account_firstname, // Needed for Sticky
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
      account_id,
    })
  }
}

/* ****************************************
 * Process Logout
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement,  buildUpdateAccount, updateAccount, changePassword, accountLogout };