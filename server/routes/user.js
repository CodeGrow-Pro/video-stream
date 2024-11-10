import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUser, update } from "../controllers/user.js";


const router = express.Router();

//get  user
router.get("/", verifyToken, getUser);
router.put("/:id", verifyToken, update);




export default router;