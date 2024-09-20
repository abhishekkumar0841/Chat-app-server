const UserModel = require("../models/UserModel");

const checkEmail = async(req, res)=>{
    const {email} = req.body
    try {
        const registeredUser = await UserModel.findOne({email}).select('-password')

        if(!registeredUser){
            return res.status(400).json({
                message: "This email is not registered with us",
                error: true,
            })
        }

        return res.status(200).json({
            message: "Email verification successful",
            success: true,
            data: registeredUser
        })

    } catch (error) {
        console.log(error.message || error);
        return res.status(500).json({
            message: error.message || error,
            error: true,
        })
    }
}

module.exports = checkEmail