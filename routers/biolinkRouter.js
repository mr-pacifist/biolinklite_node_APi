// external imports
const express = require("express");
const router = express.Router();


// internal imports
const getBiolink = require("../controllers/biolinkController");


router.get("/:subDirectory", getBiolink );



module.exports = router;