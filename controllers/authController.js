const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/*@route POST 
 @desc sign in for user
 @access public*/

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser)
      return res.status(404).json({ message: "user does not exist" });
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCorrect)
      return res.status(400).json({ message: "incorrect password" });
    const token = jwt.sign(
      {
        email: existingUser.email,
        accessLevel: existingUser.accessLevel,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ user: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, confirmpassword, fullName } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(404).json({ message: "user already exist" });
    }
    if (password !== confirmpassword) {
      return res.status(404).json({ message: "password doesn't match" });
    }
    const hashedpassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      password: hashedpassword,
    });

    const token = jwt.sign(
      { email: user.email, admin: user.admin },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "user created successfully" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
};
