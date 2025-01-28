const express = require('express')

const userController = require('./controllers/userController')
const router = express.Router()

router.get('/', userController.home)
// router.get('/ar', userController.openAR)

router.post('/register', userController.register)
// router.post('/verify-otp', userController.verifyPhone)
router.post('/logout', userController.logout)

module.exports = router