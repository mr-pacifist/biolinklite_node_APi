// external imports
const express = require("express");
const router = express.Router();


// internal imports
const {getBiolink,getBiolinkByProfileId} = require("../controllers/biolinkController");
// set retlimit
const limiter = require("../middlewares/common/limiter");

router.get("profile/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})", limiter, getBiolinkByProfileId);
router.get("profile/:subDirectory",limiter, getBiolink );



module.exports = router;
