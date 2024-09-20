const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken')

const checkPassword = async(req, res) =>{
    const {password, userId} = req.body;
    try {
        const user = await UserModel.findById(userId)

        const verifyPassword = await bcrypt.compare(password, user.password)

        if(!verifyPassword){
            return res.status(400).json({
                message: "Wrong password",
                error: true,
            })
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email
        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});

        const cookieOptions = {
            http: true,
            secure: true,
            // expires: new Date(Date.now() + 1 * 60 * 1000), //for 1 minute
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // for 7 days
        }

        return res.cookie('token', token, cookieOptions).status(200).json({
            message: "Logged in successfully",
            token: token,
            success: true,
        })

    } catch (error) {
        console.log(error.message || error);
        return res.status(500).json({
            message: error.message || error,
            error: true,
        })
    }
}

module.exports = checkPassword