const router = require('express').Router();
const User = require('../models/user'); // why not User in capital letter?
const bcrypt = require('bcrypt');

// register
router.post('/register', async (req, res) => { // this is the route for /api/auth/
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10); // 10 is the salt round
        const hashedPassword = await bcrypt.hash(req.body.password, salt); // hash the password
        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        // save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // find the user
        !user && res.status(404).json('User not found!');
        const validated = await bcrypt.compare(req.body.password, user.password); // compare the password
        !validated && res.status(400).json('Wrong password!');
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

});

module.exports = router;