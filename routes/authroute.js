import { Router } from "express";
import {
  createUsers,
  findUser,
  getProfile,
} from "../controllers/authcontroller.js";
import { authenticateUser } from "../middleware/authmiddleware.js";

const router = new Router();
router.post("/register", createUsers);
router.post("/login", findUser);
router.get("/profile", authenticateUser, getProfile);
export default router;
