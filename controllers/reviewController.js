const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ****************************************
* Add Review
* *************************************** */
reviewCont.addReview = async function (req, res) {
  const { review_text, inv_id, account_id } = req.body
  const result = await reviewModel.addReview(review_text, inv_id, account_id)

  if (result) {
    req.flash("notice", "Review added successfully.")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, the review addition failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ****************************************
* Deliver Edit Review View
* *************************************** */
reviewCont.buildEditReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  const account_id = res.locals.accountData.account_id
  const inv_id = res.locals.accountData.inv_id
  
    
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  
  
  // Security check: ensure the logged-in user owns this review
  if(res.locals.accountData.account_id !== reviewData.account_id) {
      req.flash("notice", "You are not authorized to edit this review.")
      return res.redirect("/account/")
  }

  res.render("review/edit", {
    title: `Edit Review ${reviewData.review_date.toLocaleDateString()}`,
    nav,
    description: "Review Edit Page.",
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_date: reviewData.review_date,
    account_id,
    inv_id,
  })
}

/* ****************************************
* Handle Review Update
* *************************************** */
reviewCont.updateReview = async function (req, res, next) {
  const { review_id, review_text } = req.body
  const updateResult = await reviewModel.updateReview(review_id, review_text)

  if (updateResult) {
    req.flash("notice", "The review was successfully updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewById(review_id)
    res.render("review/edit", {
      title: `Edit Review ${reviewData.review_date.toLocaleDateString()}`,
      nav,
      description: "Review Edit Page.",
      errors: null,
      review_id: review_id,
      review_text: review_text,
      review_date: reviewData.review_date
    })
  }
}

/* ****************************************
* Deliver Delete Confirmation View
* *************************************** */
reviewCont.buildDeleteReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)

  // Security check
  if(res.locals.accountData.account_id !== reviewData.account_id) {
    req.flash("notice", "You are not authorized to delete this review.")
    return res.redirect("/account/")
  }

  res.render("review/delete", {
    title: "Delete Review",
    nav,
    description: "Review Delete Page.",
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_date: reviewData.review_date
  })
}

/* ****************************************
* Handle Review Delete
* *************************************** */
reviewCont.deleteReview = async function (req, res, next) {
  const { review_id } = req.body
  const deleteResult = await reviewModel.deleteReview(review_id)

  if (deleteResult) {
    req.flash("notice", "The review was deleted.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/review/delete/${review_id}`)
  }
}

module.exports = reviewCont