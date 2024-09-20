const express = require('express');
const registerUser = require('../controllers/registerUser');
const checkEmail = require('../controllers/checkEmail');
const checkPassword = require('../controllers/checkPassword');
const userDetails = require('../controllers/userDetails');
const logout = require('../controllers/logout');
const updateUserDetails = require('../controllers/updateUserDetails');
const searchUser = require('../controllers/searchUser');

const router = express.Router();

router.post('/register', registerUser)
router.post('/email', checkEmail)
router.post('/password', checkPassword)
router.get('/user-details', userDetails)
router.post('/logout', logout)
router.put('/update-details', updateUserDetails)
router.get('/search-user', searchUser)

module.exports = router;