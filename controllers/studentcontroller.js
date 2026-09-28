import {
  findsAllStudents,
  findStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentservice.js";

// GET /students
export const getStudents = async (req, res, next) => {
  try {
    const student = await findsAllStudents();
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// GET students/:id
export const getStudentsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (Number(id) !== req.user.userId) {
      return res.status(403).json({
        error: "You are not allowed to access this student",
      });
    }

    const student = await findStudentById(id);
    if (!student) {
      return res.status(404).json({
        error: "student not found",
      });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

//POST /students
export const createStudents = async (req, res, next) => {
  try {
    const { name } = req.body;
    const student = await createStudent(name);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

//PUT /students/:id
export const updateStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const student = await updateStudent(id, name.trim());
    if (!student) {
      return res.status(404).json({
        error: "student not found",
      });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// DELETE /students/:id
export const deleteStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await deleteStudent(id);
    if (!student) {
      return res.status(404).json({
        error: "student not found",
      });
    }
    res.status(200).json({
      message: "Student deleted successfully",
      student,
    });
  } catch (error) {
    next(error);
  }
};
