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
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            // if already following or not
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({
                    $push: { followings: req.params.id },
                });
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You already follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        // same user
        res.status(403).json("You cant follow yourself");
    }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            // if already following or not
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({
                    $pull: { followings: req.params.id },
                });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You dont follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        // same user
        res.status(403).json("You cant unfollow yourself");
    }
});

module.exports = router;
