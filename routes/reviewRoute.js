const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const reviewController = require("../controllers/reviewController")
const reviewValidate = require("../utilities/review-validation")

// Add a new review
router.post(
    "/add", 
    utilities.checkLogin, 
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.addReview)
)

// Deliver Edit Review View
router.get(
    "/edit/:review_id", 
    utilities.checkLogin, 
    utilities.handleErrors(reviewController.buildEditReview)
)

// Update Review Process
router.post(
    "/update", 
    utilities.checkLogin, 
    reviewValidate.reviewRules(), // Reuse rules, though update only needs text
    reviewValidate.checkUpdateReviewData,
    utilities.handleErrors(reviewController.updateReview)
)

// Deliver Delete Confirmation View
router.get(
    "/delete/:review_id", 
    utilities.checkLogin, 
    utilities.handleErrors(reviewController.buildDeleteReview)
)

// Delete Review Process
router.post(
    "/delete", 
    utilities.checkLogin, 
    utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router