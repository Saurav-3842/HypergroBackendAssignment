const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
          status: "fail",
          message: "Email, password required!",
        });
      }
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(201).json({
      status: "success",
      message: "User created",
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error!",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: parseInt(process.env.COOKIE_EXPIRES_IN_MS || "3600000", 10),
    });
    res.status(200).json({
      status: "success",
      message: "User LoggedIn",
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
        },
      },
    });
  } catch (err) {
    res.status(500);
    res.json({
      status: "fail",
      message: "Internal Server Error!",
    });
  }
};
