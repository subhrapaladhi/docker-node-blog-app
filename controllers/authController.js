const User = require("../models/userModel");
const bcypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcypt.hash(password, 12);
    const newUser = await User.create({ username, password: hashedPassword });
    console.log(newUser);
    req.session.user = newUser
    res.status(200).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }
    const isCorrect = await bcypt.compare(password, user.password);

    if (isCorrect) {
      console.log(req.session);
      req.session.user = JSON.stringify(user);
      return res.status(200).json({
        status: "success",
      });
    }
    return res.status(400).json({
      status: "fail",
      message: "incorrect username or password",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
    });
  }
};
