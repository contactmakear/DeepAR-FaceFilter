const express = require('express')

const userController = require('./controllers/userController')
const { upload } = require("./src/imageHandler");
const router = express.Router()

router.get('/', userController.home)
router.get('/ar', userController.mustBeLoggedIn, userController.openAR)

router.get('/getAR', (req, res) => {
    res.render("ar")
})

router.get('/logout', (req, res) => {
    res.render('logout')
})

router.get('/t&c', (req, res) => {
    res.render('t&c')
})


router.post("/get-user-id", userController.getUserSession);
router.post('/show-otp-screen', userController.showOTPScreen)
router.post('/verify-otp', userController.verifyPhone)
router.post('/register', userController.register)
router.post("/upload", upload.single("image"), userController.uploadProfileImage);
router.post('/logout', userController.logout)

module.exports = router