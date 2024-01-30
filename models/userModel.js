const mongoose = require("mongoose")
const { subSchema } = require("./subModel");

const userSchema = mongoose.Schema({
    userName: {
        type: String, 
        required: true
    },
    userEmail:{
        type: String,
        required: true
    },
    userPassword:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    sex:{
        type: String,
        enum: ['M', 'F'],
        required: true,
    },
    sub: {
        type: subSchema,
    }
})

module.exports = mongoose.model("userSchema", userSchema)
