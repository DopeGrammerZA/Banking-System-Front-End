const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/register"); // correct relative path


// POST /register
router.post("/", async (req, res) => {
    try {
        const { username, email, password, confirm } = req.body;

        if (!username || !email || !password || !confirm) {
            return res.status(400).send("All fields are required");
        }

        if (password !== confirm) {
            return res.status(400).send("Passwords do not match");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send("Email already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
