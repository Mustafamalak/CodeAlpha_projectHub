const jwt = require("jsonwebtoken");
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
        res.status(500).json({
            message: "Registration failed",
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

module.exports = {
    registerUser,
    loginUser,
    getProfile,
};