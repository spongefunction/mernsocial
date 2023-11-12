const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// test route with http://127.0.0.1:8800/api/users successed
// router.get('/', (req, res) => {
//     res.send('Hey, it\'s user route!');
// });

// update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json('Account has been updated!');
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        res.status(403).json('You can update only your account!');
    }
});

// delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted!');
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        res.status(403).json('You can delete only your account!');
    }
});

// get a user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc; // remove password and updatedAt from the response
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
});

// follow a user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id); // find the user
            const currentUser = await User.findById(req.body.userId); // find the current user
            if (!user.followers.includes(req.body.userId)) { // if the user is not followed yet
                await user.updateOne({ $push: { followers: req.body.userId } }); // add the user to the followers array
                await currentUser.updateOne({ $push: { following: req.params.id } }); // add the user to the following array
                res.status(200).json('User has been followed!');
            } else {
                res.status(403).json('You already follow this user!');
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json('You can\'t follow yourself!');
    }
});


// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id); // find the user
            const currentUser = await User.findById(req.body.userId); // find the current user
            if (user.followers.includes(req.body.userId)) { // if the user is followed
                await user.updateOne({ $pull: { followers: req.body.userId } }); // add the user to the followers array
                await currentUser.updateOne({ $pull: { following: req.params.id } }); // add the user to the following array
                res.status(200).json('User has been unfollowed!');
            } else {
                res.status(403).json('You are not following this user!');
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json('You can\'t unfollow yourself!');
    }
});


module.exports = router;