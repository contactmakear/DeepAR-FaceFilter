const express = require('express')

const userController = require('./controllers/userController')
const { upload } = require("./src/imageHandler");
const router = express.Router()

router.get('/', userController.home)
// router.get('/ar', userController.openAR)


router.post("/get-user-id", userController.getUserSession);
router.post('/register', userController.register)
router.post('/verify-otp', userController.verifyPhone)
router.post("/upload", upload.single("image"), userController.uploadProfileImage);
router.post('/logout', userController.logout)

module.exports = router