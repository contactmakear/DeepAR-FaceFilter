const path = require("path")

exports.home = function(req, res) {
    // res.sendFile(path.join(__dirname, "../public", "form.html"));
    res.render('form')
}