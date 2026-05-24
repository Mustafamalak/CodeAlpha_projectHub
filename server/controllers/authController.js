const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, position } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password",
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                message: "Name must be at least 2 characters long",
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            position,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                position: user.position,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        // MongoDB duplicate key error (e.g. email already exists)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "An account with this email already exists.",
            });
        }
        res.status(500).json({
            message: "Registration failed. Please try again.",
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                position: user.position,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        user: req.user,
    });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide your email address." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            // Generic message to prevent email enumeration
            return res.status(200).json({
                message: "If an account with that email exists, a reset token has been generated.",
                found: false,
            });
        }

        // Generate plain token and its hashed version
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            message: "Reset token generated successfully.",
            found: true,
            // In production this would be emailed. Returned here for demo purposes.
            resetToken: plainToken,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not process request. Please try again.",
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long.",
            });
        }

        // Hash the incoming plain token to compare with DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Reset token is invalid or has expired. Please request a new one.",
            });
        }

        // Update password — pre-save hook will hash it
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully. You can now log in with your new password.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Password reset failed. Please try again.",
            error: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    forgotPassword,
    resetPassword,
};