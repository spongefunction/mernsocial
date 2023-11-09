const router = require('express').Router();
module.exports = router;

router.get('/', (req, res) => { // this is the route for /api/users/
    res.send('Hey, it\'s user route!');
});