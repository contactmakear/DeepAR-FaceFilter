const express = require('express')

const userController = require('./controllers/userController')
const router = express.Router()

router.get('/', userController.home)
router.get('/ar', (req, res) => {
    res.render('ar')
})

router.post('/verify', userController.showOTPScreen)
router.post('/verify-otp', userController.verifyPhone)

module.exports = router;