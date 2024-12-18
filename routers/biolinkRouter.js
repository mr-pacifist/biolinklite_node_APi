// external imports
const express = require("express");
const router = express.Router();


// internal imports
const getBiolink = require("../controllers/biolinkController");
// set retlimit
const limiter = require("../middlewares/common/limiter");

router.get("/:subDirectory",limiter, getBiolink );



module.exports = router;