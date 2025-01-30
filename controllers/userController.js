const path = require("path")
const axios = require('axios')
const { User, updateUserProfileImage } = require('../models/User')
const { processImage } = require("../src/imageHandler");
const dotenv = require('dotenv').config()

exports.home = function (req, res) {
    if (req.session.user) {
        res.render('ar')
    } else {
        res.render('form')
    }
}

exports.getUserSession = (req, res) => {
    if (req.session.user) {
        res.json({ success: true, userId: req.session.user._id });
    } else {
        res.status(401).json({ success: false, message: "User not logged in" });
    }
}

exports.mustBeLoggedIn = function (req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.flash("errors", "You must be registered to visit that page.")
        req.session.save(function () {
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
            res.json({ status: error.Details })
            console.log("error", error);
        });
}

exports.register = async function (req, res) {

    const { phone, age, ageCheckbox, smokerCheckbox } = req.body

    let user = new User({ phone, age, ageCheckbox, smokerCheckbox })

    await user.register().then((status) => {
        if (status == 'success') {
            req.session.user = { _id: user.data._id, phone: user.data.phone }
            req.session.save(function () {
                res.json({ status: 'Success' })
                // res.redirect('/')
            })
        } else if (status == 'mobile exists') {
            req.session.save(function () {

            })
        }
    }).catch((e) => {
        console.log(e);
        req.flash('errors', e)
        req.session.save(function () {
            res.json({ status: 'Failed' })
            // res.redirect('/')
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
        url: `https://2factor.in/API/V1/${process.env.TWOFACTORKEY}/SMS/VERIFY/${req.body.details}/${req.body.userOTP}`,
        headers: {}
    }

    axios(config)
        .then(async (response) => {
            console.log(JSON.stringify(response.data));
            res.json(response.data.Status)
        })
        .catch((error) => {
            res.json("OTP Mismatch !!")
        })
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/')
    })
}

// API to Upload and Update Profile Image
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Compress the Image
        const compressedImagePath = await processImage(req.file);

        // Update User Profile in Database
        const updatedImagePath = await updateUserProfileImage(req.body.userId, compressedImagePath);

        res.json({ success: true, imagePath: updatedImagePath });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Image upload failed" });
    }
};