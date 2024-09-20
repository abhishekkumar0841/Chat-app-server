const UserModel = require("../models/UserModel");

const searchUser = async (req, res) => {
  const search = req.query.search || "";
  const limit = parseInt(req.query.limit) || 4;
  const page = parseInt(req.query.page) || 1;

  const searchFilter = {
    $or: [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  };
  try {
    const users = await UserModel.find(searchFilter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      message: "All registered users.",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error.message || error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

module.exports = searchUser;
