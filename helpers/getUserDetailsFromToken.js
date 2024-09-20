const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailsFromToken = async (token)=>{
    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await UserModel.findById(decode.id).select("-password")
        return user;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = getUserDetailsFromToken