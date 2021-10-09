const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // in case if a password update, generate a new salt
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt();
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }

        // updating user
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
                //automatically sets all inputs inside the req.body
            });
            res.status(200).json("Account have been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});

// delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete({ _id: req.params.id });

            res.status(200).json("Your account have been deleted!");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});

// get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, isAdmin, updatedAt, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//follow a user
//unfollow a user

module.exports = router;
