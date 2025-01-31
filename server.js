const express = require("express");
const path = require("path");
const MongoStore = require('connect-mongo') 
var session = require('express-session')
const router = require('./router')
const dotenv = require('dotenv').config
const flash = require('connect-flash')


const app = express();

let sessionOptions = session({
  secret: "seven sisters from north of india",
  store: MongoStore.create({client: require('./db')}),
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpsOnly: true}
})

app.use(sessionOptions)

app.use(flash())
app.use(function (req, res, next) {

  // res.locals.user = req.session.user
  //make all errors and success flash messages available
  res.locals.errors = req.flash("errors")
  // res.locals.failed = req.flash("failed")
  res.locals.success = req.flash("success")

  next()
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static("public/effects"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve Static Files (Uploaded Images)
app.use("/uploads", express.static("public/uploads"));

// Serve DeepAR resources
app.use("/deepar-resources",
  express.static(path.join(__dirname, "node_modules/deepar"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
      }
    },
  })
)

app.use('/', router)

// Fallback for SPA routing (optional)
app.get("*", (req, res) => {
  res.render('404')
});


module.exports = app