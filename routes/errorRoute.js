const express = require("express");
const router = express.Router();

// This route intentionally throws an error
router.get("/cause-error", (req, res, next) => {
  throw new Error("Intentional server error for testing.");
});

module.exports = router;
