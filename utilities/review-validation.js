const utilities = require(".")
const { body, validationResult } = require("express-validator")
const reviewModel = require("../models/review-model")

const validate = {}

/* **********************************
 * Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
    return [
        body("review_text")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Review text is required.")
            .isLength({ min: 1 })
            .withMessage("Review text cannot be empty."),
    ]
}

/* **********************************
 * Check data and return errors or continue (For Adding)
 * ********************************* */
validate.checkReviewData = async (req, res, next) => {
    const { review_text, inv_id, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        // We need to fetch the inventory data again to re-render the detail view
        // Note: This requires requiring the inventory model here or handling the redirect differently.
        // For simplicity in this architecture, we will redirect back with flash.
        req.flash("notice", errors.array()[0].msg)
        res.redirect(`/inv/detail/${inv_id}`)
        return
    }
    next()
}

/* **********************************
 * Check data and return errors or continue (For Updating)
 * ********************************* */
validate.checkUpdateReviewData = async (req, res, next) => {
    const { review_id, review_text } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const reviewData = reviewModel.getReviewById(review_id)
        res.render("review/edit", {
            title: "Edit Review",
            nav,
            description: "Review Edit Page.",
            errors,
            review_id: review_id,
            review_text: review_text, 
            review_date: reviewData.review_date, // Keep original date context
        })
        return
    }
    next()
}

module.exports = validate