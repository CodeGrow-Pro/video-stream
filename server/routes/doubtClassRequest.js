import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addAttendees, createDoubtClassRequest, getDoubtClassById, getDoubtClassRequest, getDoubtClassRequestByUser, updateDoubtClassStatus } from "../controllers/DoubtClassRequest.js";


const router = express.Router();

router.post("/", verifyToken, createDoubtClassRequest);
router.get("/", verifyToken, getDoubtClassRequest);
router.put("/update/:id", verifyToken, updateDoubtClassStatus);
router.get("/byUser", verifyToken, getDoubtClassRequestByUser);
router.get("/get/:id", verifyToken, getDoubtClassById)
router.post("/addview/:id", verifyToken, addAttendees);


export default router;