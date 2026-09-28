import { Router } from "express";
import { createUsers, findUser } from "../controllers/authcontroller.js";
const router = new Router();
router.post("/register", createUsers);
router.post("/login", findUser);
export default router;
