const path = require("path")
const axios = require('axios')
const User = require('../models/User')
const dotenv = require('dotenv').config()

exports.home = function(req, res) {
    if (req.session.user) {
        res.render('ar')
    } else {
        res.render('form')
    }
}

exports.mustBeLoggedIn = function (req, res, next) {
    if(req.session.user) {
        next()
    } else {
        req.flash("errors", "You must be registered to visit that page.")
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

exports.showOTPScreen = function (req, res) {
    var sendOTP = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://2factor.in/API/V1/${process.env.TWOFACTORKEY}/SMS/+91${req.body.phone}/AUTOGEN2/OTP1`,
        headers: {}
    }

    axios(sendOTP)
        .then(function (response) {
            console.log(JSON.stringify(response.data))
            details = {
                status: response.data.Status,
                details: response.data.Details,
            }
            res.json(details)
        })
        .catch(function (error) {
            console.log(error);
        });
}

exports.register = async function(req, res) {
    let user = new User(req.body)
    await user.register().then(() => {
        req.session.user = { _id: user.data._id, phone: user.data.phone }
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch((e) => {
        req.flash('errors', e)
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.openAR = function (req, res) {
    res.render('ar')
}

exports.verifyPhone = function (req, res) {
    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://2factor.in/API/V1/c614dba0-dc92-11ef-8b17-0200cd936042/SMS/VERIFY/${req.body.details}/${req.body.userOTP}`,
        headers: {}
    }

    axios(config)
        .then(async (response) => {
            console.log(JSON.stringify(response.data));
            
            res.json(response.data.Status)
        })
        .catch((error) => {
            console.log(error);
        })
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/')
    })
}