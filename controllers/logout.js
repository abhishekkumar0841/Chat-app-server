const logout = async (req, res)=>{
    const cookieOptions = {
        http: true,
        secure: true,
        expires: new Date(0)
    }

    try {
        return res.cookie('token', '', cookieOptions).status(200).json({
            message: "User logged out successfully",
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

module.exports = logout