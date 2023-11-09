const router = require('express').Router();
const User = require('../models/user'); // why not User in capital letter?

// register
router.post('/register', async (req, res) => { // this is the route for /api/auth/
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});



module.exports = router;