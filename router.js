const express = require('express')

const userController = require('./controllers/userController')
const router = express.Router()

router.get('/', userController.home)
router.get('/ar', (req, res) => {
    res.render('ar')
})

module.exports = router;