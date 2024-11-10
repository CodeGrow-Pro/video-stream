import mongoose from "mongoose";
import { createError } from "../error.js";
import User from "../models/User.js";
import DoubtClassRequest from "../models/DoubtClassRequest.js";

export const createDoubtClassRequest = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        // Create a new podcast
        const Class = new DoubtClassRequest(
            {
                creator: user.id,
                class: user?.class,
                ...req.body
            }
        );

        const savedClass = await Class.save();

        //save the podcast to the user
        await User.findByIdAndUpdate(user.id, {
            $push: { doubtClassRequest: savedClass.id },
        }, { new: true });

        res.status(201).json(savedClass);

    } catch (err) {
        next(err);
    }
};

export const getDoubtClassRequest = async (req, res, next) => {
    try {
        const filterObject = {
            creator: { $ne: req.user.id },
            rejectedBy: { $ne: req.user.id }
        }
        const user = await User.findById(req.user.id).lean()

        if (user.class) {
            filterObject.class = user?.class

        }
        let strength = []
        if (user?.strengthSubjects) {
            strength = user?.strengthSubjects?.map((it) => {
                return it?.subject?.toLowerCase()
            })
            filterObject.subject = { $in: strength }
        }
        console.log(filterObject)
        const doubtClass = await DoubtClassRequest.find(filterObject)?.sort({ $natural: -1 }).populate("creator", "name img gender").populate("acceptedBy", "name img");
        let res1 = doubtClass?.filter((it) => {
            let val = ''
            user?.strengthSubjects?.filter((fit) => {
                console.log(fit?.subject?.toLowerCase(), it?.subject?.toLowerCase(), fit?.level, it?.doubtLevel, it?.creator?.gender?.toLowerCase(), user?.gender?.toLowerCase())
                if (fit?.subject?.toLowerCase() == it?.subject?.toLowerCase() && fit?.level >= it?.doubtLevel && it?.creator?.gender?.toLowerCase() == user?.gender?.toLowerCase()) {
                    val = it
                }
            })
            if (val) {
                return val
            }
        })
        return res.status(200).json(res1);
    } catch (err) {
        next(err);
    }
};

export const getDoubtClassRequestByUser = async (req, res, next) => {
    try {
        const doubtClass = await DoubtClassRequest.find({ creator: req?.user?.id }).populate("creator", "name img").populate("acceptedBy", "name img");
        return res.status(200).json(doubtClass);
    } catch (err) {
        next(err);
    }
};

export const getDoubtClassById = async (req, res, next) => {
    try {
        const doubtClass = await DoubtClassRequest.findById(req.params.id).populate("creator", "name img").populate("acceptedBy", "name img");
        return res.status(200).json(doubtClass);
    } catch (err) {
        next(err);
    }
};

// export const favoritPodcast = async (req, res, next) => {
//     // Check if the user is the creator of the podcast
//     const user = await User.findById(req.user.id);
//     const podcast = await Podcasts.findById(req.body.id);
//     let found = false;
//     if (user.id === podcast.creator) {
//         return next(createError(403, "You can't favorit your own podcast!"));
//     }

//     // Check if the podcast is already in the user's favorits
//     await Promise.all(user.favorits.map(async (item) => {
//         if (req.body.id == item) {
//             //remove from favorite
//             found = true;
//             console.log("this")
//             await User.findByIdAndUpdate(user.id, {
//                 $pull: { favorits: req.body.id },

//             }, { new: true })
//             res.status(200).json({ message: "Removed from favorit" });

//         }
//     }));


//     if (!found) {
//         await User.findByIdAndUpdate(user.id, {
//             $push: { favorits: req.body.id },

//         }, { new: true });
//         res.status(200).json({ message: "Added to favorit" });
//     }
// }

//add view 

export const addAttendees = async (req, res, next) => {
    try {
        await Podcasts.findByIdAndUpdate(req.params.id, {
            $inc: { totalAttendees: 1 },
        });
        res.status(200).json("The view has been increased.");
    } catch (err) {
        next(err);
    }
};

export const updateDoubtClassStatus = async (req, res, next) => {
    try {
        if (req.body.status == "accepted") {
            const updatedClass = await DoubtClassRequest.findByIdAndUpdate(req.params.id, { status: req.body.status, acceptedBy: req.user.id, classMeetingLink: req.body.classMeetingLink }, { new: true });
            return res.status(200).json(updatedClass);
        } else if (req.body.status == 'rejected') {
            const updatedClass = await DoubtClassRequest.findByIdAndUpdate(req.params.id, { $push: { rejectedBy: req.user.id } }, { new: true });
            return res.status(200).json(updatedClass);
        } else {
            const updatedClass = await DoubtClassRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
            return res.status(200).json(updatedClass);
        }
    } catch (err) {
        next(err);
    }
}