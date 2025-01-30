const usersCollection = require('../db').db().collection("users")
const ObjectId = require('mongodb').ObjectId
const axios = require('axios')
const dotenv = require('dotenv').config()

let User = function (data, userid) {
  this.data = data
  this.errors = []
  this.userid = userid
}

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.phone == "") { this.errors.push("You must provide a phone number.") }
    if (!/^\d{10}$/.test(this.data.phone)) { this.errors.push('Invalid phone number.') }

    if (!this.data.age) {
      this.errors.push("Age is required.");
    }
    if (isNaN(this.data.age) || this.data.age < 18 || this.data.age > 110) {
      this.errors.push("Age must be a number between 18 and 110.");
    }

    if (!this.data.ageCheckbox || this.data.ageCheckbox !== "accepted") {
      this.errors.push("You must accept the age confirmation checkbox.");
    }
    if (!this.data.smokerCheckbox || this.data.smokerCheckbox !== "accepted") {
      this.errors.push("You must accept the smoker checkbox.");
    }



    resolve()
  })
}

User.prototype.cleanUp = function () {
  if (typeof (this.data.phone) != "string") { this.data.phone = "" }
  if (typeof this.data.age !== "string") this.data.age = "";
  if (typeof this.data.ageCheckbox !== "string") this.data.ageCheckbox = "";
  if (typeof this.data.smokerCheckbox !== "string") this.data.smokerCheckbox = "";


  //remove bogus properties
  this.data = {
    phone: this.data.phone.trim(),
    age: this.data.age ? parseInt(this.data.age, 10) : "",
    ageCheckbox: this.data.ageCheckbox.trim().toLowerCase(),
    smokerCheckbox: this.data.smokerCheckbox.trim().toLowerCase(),
    profileImages: [],
    registeredDate: new Date()
  }
}

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    //validate user data
    this.cleanUp()
    await this.validate()

    // Only if phone is valid then check to see if it's already taken
    if (!this.errors.length) {
      let phoneNumberExists = await usersCollection.findOne({ phone: this.data.phone })
      if (phoneNumberExists) {
        //  this.errors.push("Phone number already registered.")
        this.data._id = phoneNumberExists._id  
        resolve("success")
      } else {
        await usersCollection.insertOne(this.data)
        this.data._id = result.insertedId
        resolve('success')
      }
    } else {
      reject(this.errors)
    }

    //Submit data if there are no error
    // if (!this.errors.length) {
    //   await usersCollection.insertOne(this.data)
    //   resolve('success')
    // } else {
    //   reject(this.errors)
    // }
  })
}

User.userQuery = function () {
  return new Promise(async (resolve, reject) => {
    let users = await usersCollection.find({}).toArray()
    resolve(users)
  })
}

User.userById = function(userid) {
  return new Promise(async (resolve, reject) => {
    let user = await usersCollection.findOne({ _id: new ObjectId(userid) })
    resolve(user)
  })
}

User.deleteUser = async function(userid) {
  return new Promise(async (resolve, reject) => {
    let user = await usersCollection.deleteOne( {_id: new ObjectId(userid)} )
    resolve(user)
  })
}

// Function to Update User Profile with Image
const updateUserProfileImage = async (userId, imagePath) => {
  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: { profileImages: imagePath }
      }
    )

    if (result.modifiedCount === 0) {
      throw new Error("User not found or image update failed.");
    }

    // console.log("User profile image updated:", imagePath);
    return imagePath;
  } catch (error) {
    console.error("Error updating user profile image:", error);
    throw error;
  }
}

module.exports = { User, updateUserProfileImage }