import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: "",
    },
    img: {
        type: String,
        default: "",
    },
    googleSignIn: {
        type: Boolean,
        required: true,
        default: false,
    },
    podcasts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    },
    doubtClassRequest: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "DoubtClassRequest",
        default: null,
    },
    favorits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    },
    gender: {
        type: String,
        default: "Male",
    },
    dob: {
        type: Date,
        default: null,
    },
    location: {
        type: String,
        default: null,
    },
    class: {
        type: Number,
        default: null
    },
    strengthSubjects: [{
        subject: String,
        level: Number
    }],
    weakSubjects: [{
        subject: String,
        level: Number
    }]
},
    { timestamps: true }
);


export default mongoose.model("User", UserSchema);