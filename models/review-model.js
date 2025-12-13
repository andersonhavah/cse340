const pool = require("../database/")

/* *****************************
 * Get reviews by Inventory ID
 * *************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM public.review AS r 
                 JOIN public.account AS a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    return new Error("Get reviews by inventory id error " + error)
  }
}

/* *****************************
 * Get reviews by Account ID
 * *************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model 
                 FROM public.review AS r 
                 JOIN public.inventory AS i ON r.inv_id = i.inv_id 
                 WHERE r.account_id = $1 
                 ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return new Error("Get reviews by account id error " + error)
  }
}

/* *****************************
 * Get a specific review by Review ID
 * *************************** */
async function getReviewById(review_id) {
  try {
    const sql = `SELECT * FROM public.review WHERE review_id = $1`
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
  } catch (error) {
    return new Error("Get review by id error " + error)
  }
}

/* *****************************
 * Add a new review
 * *************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = `INSERT INTO public.review (review_text, inv_id, account_id) 
                 VALUES ($1, $2, $3) RETURNING *`
    const data = await pool.query(sql, [review_text, inv_id, account_id])
    return data.rows[0]
  } catch (error) {
    return new Error("Add review error " + error)
  }
}

/* *****************************
 * Update a review
 * *************************** */
async function updateReview(review_id, review_text) {
  try {
    const sql = `UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *`
    const data = await pool.query(sql, [review_text, review_id])
    return data.rows[0]
  } catch (error) {
    return new Error("Update review error " + error)
  }
}

/* *****************************
 * Delete a review
 * *************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM public.review WHERE review_id = $1'
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    return new Error("Delete review error " + error)
  }
}

module.exports = {
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  addReview,
  updateReview,
  deleteReview
}