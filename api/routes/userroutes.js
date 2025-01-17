const express = require("express");
const { registerUser, loginUser } = require("../controllers/usercontroller");
const router = express.Router();

// POST: Register a new user
router.post("/register", registerUser);

// POST: Login an existing user
router.post("/login", loginUser);

module.exports = router;
