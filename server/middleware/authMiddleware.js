const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        next();
    } catch (error) {
        res.status(401).json({
            message: "Not authorized, token failed",
            error: error.message,
        });
    }
};

const isProjectMember = (project, userId) => {
    if (!project || !project.members) return false;
    return project.members.some(
        (member) => (member._id || member).toString() === userId.toString()
    );
};

const isProjectOwner = (project, userId) => {
    if (!project || !project.owner) return false;
    return (project.owner._id || project.owner).toString() === userId.toString();
};

module.exports = {
    protect,
    isProjectMember,
    isProjectOwner,
};