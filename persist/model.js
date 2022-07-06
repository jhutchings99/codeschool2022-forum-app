const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
    {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    body: { type: String, required: true, default: ""},
    thread_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        required: true,
    },
    },
    { timestamps: true }
)

const threadSchema = mongoose.Schema(
    {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true, default: "" },
    description: { type: String, required: true, default: "" },
    posts: { type: [postSchema], required: false, default: [] },
    category: { type: String, required: true, default: "" },
    },
    {
    timestamps: true,
    // toJSON: { virtuals: true }
    }
);

const userSchema = mongoose.Schema({
    username: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
        required: true,
        unique: true,
    },
    fullname: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
const Thread = mongoose.model("Thread", threadSchema)

module.exports = {
    Thread,
    User,
}