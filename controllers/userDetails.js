const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

const userDetails = async(req, res)=>{
    try {
        const token = req.cookies.token || ""

        if(!token){
            return res.status(400).json({
                message: "Session timeout or token expired, logged in again",
                error: true
            })
        }

        const user = await getUserDetailsFromToken(token)

        return res.status(200).json({
            message: "User details got successfully",
            data: user,
            success: true
        })
    } catch (error) {
        console.log(error.message || error);
        return res.status(500).json({
            message: error.message || error,
            error: true,
        })
    }
}

module.exports = userDetails