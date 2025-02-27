import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./users.model.js";

const JWT_SECRET =
  "f873c65e7bdf4e8aaf3e86a8a091b3f6c9d1452e47a6741d512af0f7df06a5a8";
const JWT_REFRESH_SECRET =
  "9c7b3a84f41d487ab987e4a77bc6e9d2f4824e8bdc3b4ef8a2f6c9d7435be5c9";

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res
      .status(500)
      .json({ message: "Error refreshing access token", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
};
