const express = require("express");
const path = require("path");
const MongoStore = require('connect-mongo') 
var session = require('express-session')
const router = require('./router')
const dotenv = require('dotenv').config

const app = express();

let sessionOptions = session({
  secret: "seven sisters from north of india",
  store: MongoStore.create({client: require('./db')}),
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpsOnly: true}
})

app.use(sessionOptions)

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")))

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory for views
app.set("views", path.join(__dirname, "views"));

// Serve DeepAR resources
app.use("/deepar-resources",
  express.static(path.join(__dirname, "node_modules/deepar"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
      }
    },
  })
);

app.use('/', router)

// Fallback for SPA routing (optional)
app.get("*", (req, res) => {
  res.render('404')
});


module.exports = app