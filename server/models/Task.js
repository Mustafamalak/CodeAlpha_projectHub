const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["Todo", "In Progress", "Done"],
            default: "Todo",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        dueDate: {
            type: Date,
            required: true,
        },

        comments: [commentSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);