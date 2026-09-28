import express, { Router } from "express";

import {
  getStudents,
  getStudentsById,
  createStudents,
  updateStudents,
  deleteStudents,
} from "../controllers/studentcontroller.js";

import { validateStudent } from "../middleware/studentmiddleware.js";
import { authenticateUser } from "../middleware/authmiddleware.js";

const router = new Router();

router.get("/", getStudents);
router.get("/:id", authenticateUser, getStudentsById);
router.post("/", createStudents, validateStudent);
router.put("/:id", updateStudents, validateStudent);
router.delete("/:id", deleteStudents);

export default router;
