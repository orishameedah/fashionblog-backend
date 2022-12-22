import express from "express";
import { getAllUser, login, signup } from "../controllers/user-controller.js";

const router = express.Router()

router.get("/", getAllUser);  //get means to fetch
router.post("/signup", signup);  //post means to insert or put 
router.post("/login", login); //post means to insert or put

export default router