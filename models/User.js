const usersCollection = require('../db').db().collection("users")
const ObjectId = require('mongodb').ObjectId
const axios = require('axios')
const dotenv = require('dotenv').config()

let User = function (data) {
    this.data = data
    this.errors = []
}

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if (this.data.phone == "") { this.errors.push("You must provide a phone number.") }
        if (!/^\d{10}$/.test(this.data.phone)) { this.errors.push('Invalid phone number.') }

        // Only if phone is valid then check to see if it's already taken
        if (!this.errors.length) {
            let phoneNumberExits = await usersCollection.findOne({ phone: this.data.phone })
            if (phoneNumberExits) { this.errors.push("Phone number already registered.") }
        }
        resolve()
    })
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.phone) != "string") {this.data.phone = ""}

    //remove bogus properties
    this.data = {
        phone: this.data.phone,
    }
}

User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        //validate user data
        this.cleanUp()
        await this.validate()

        //Submit data if there are no error
        if(!this.errors.length) {
            await usersCollection.insertOne(this.data)
            resolve('success')
        } else {
            reject(this.errors)
        }
    })
}

// User.prototype.getOTP = function() {

//     var sendOTP = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: `https://2factor.in/API/V1/${process.env.TWOFACTORKEY}/SMS/+91${req.body.phone}/AUTOGEN2/OTP1`,
//         headers: {}
//     }

//     axios(sendOTP)
//         .then(function (response) {
//             console.log(JSON.stringify(response.data))
//             details = {
//                 status: response.data.Status,
//                 details: response.data.Details,
//             }
//             res.json(details)
//         })
//         .catch(function (error) {
//             console.log(error)
//         })
// }

// Function to Update User Profile with Image
const updateUserProfileImage = async (userId, imagePath) => {
  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { profileImage: imagePath } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("User not found or image update failed.");
    }

    console.log("User profile image updated:", imagePath);
    return imagePath;
  } catch (error) {
    console.error("Error updating user profile image:", error);
    throw error;
  }
};

module.exports = { User, updateUserProfileImage }