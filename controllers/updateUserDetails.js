const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

const updateUserDetails = async(req, res)=>{
    try {
        const token = req.cookies.token || ""
        const user = await getUserDetailsFromToken(token)
        const {name, profile_pic} = req.body;

        const updatedUser = await UserModel.findOneAndUpdate({_id: user.id}, {
            name, profile_pic
        }, {
            new: true,
            runValidators: true,
        }).select("-password")

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
            });
        }

        return res.status(200).json({
            message: "User details updated",
            data: updatedUser,
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

module.exports = updateUserDetails