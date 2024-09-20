const UserModel = require("../models/UserModel");
const bcrypt = require('bcryptjs')

const registerUser  = async(req, res)=>{
    const {name, email, password, profile_pic} = req.body;
    try {
        const isRegistered = await UserModel.findOne({email});
        
        if(isRegistered){
            return res.status(400).json({
                message: "User already registered with this email",
                error: true
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const payload = {
            name, email, profile_pic, password: hashedPassword 
        }

        const user = new UserModel(payload)
        const savedUser = await user.save();

        return res.status(201).json({
            message: "User registered successfully",
            data: savedUser,
            success: true,
        })

    } catch (error) {
        console.log(error.message || error);
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = registerUser