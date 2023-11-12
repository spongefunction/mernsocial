const router = require('express').Router();
const User = require('../models/user');
const Post = require('../models/post');

// test route with http://127.0.0.1:8800/api/post successed
router.get('/', (req, res) => {
    console.log('post page');
});

// create a post


// update a post


// delete a post


// like / dislike a post


// get a post


// get timeline posts


module.exports = router;