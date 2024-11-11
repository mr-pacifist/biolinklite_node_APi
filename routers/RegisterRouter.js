// external imports
const express = require("express");
const router = express.Router();

// internal router
const {addUser} = require("../controllers/userRegistrationController");


router.post("/", addUser);




module.exports = router;