const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // hashing password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //creating new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        });

        // saving user and resp
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        // searching for a user
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("User not found!");

        // checking password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !validPassword && res.status(400).json("Wrong Password");

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
