const express = require('express')
const path = require("path");
const router = express.Router()

// Route to serve form.html for the root URL
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "form.html"));
});

module.exports = router;