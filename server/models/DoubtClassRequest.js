import mongoose from "mongoose";

const DoubtClassRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: "",
    },
    subject: {
        type: String,
        default: "",
    },
    chapterName:{
        type: String,
        default: "",
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    doubtLevel: {
        type: String,
        default: "",
    },
    classTime: {
        type: Date,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "live", "completed", "cancelled"],
        default: "pending",
    },
    rejectedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    class: {
        type: Number,
        default: null,
    },
    classMeetingLink: {
        type: String,
        default: "",
    },
    totalAttendees: {
        type: Number,
        default: 0,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
    {
        timestamps: true,
    }
);

export default mongoose.model("DoubtClassRequest", DoubtClassRequestSchema);