import pool from "../db.js";

//GET all students
export const findsAllStudents = async () => {
  const result = await pool.query("SELECT *FROM students ORDER BY id ASC ");
  return result.rows;
};

//GET student by id
export const findStudentById = async (id) => {
  const result = await pool.query("SELECT *FROM students WHERE id=$1", [id]);
  return result.rows[0];
};

//create a student
export const createStudent = async (name) => {
  const result = await pool.query(
    "INSERT INTO students(name) VALUES ($1) RETURNING *",
    [name],
  );
  return result.rows[0];
};

//update a student
export const updateStudent = async (id, name) => {
  const result = await pool.query(
    "UPDATE students SET name=$1 WHERE id=$2 RETURNING *",
    [name, id],
  );
  return result.rows[0];
};

//delete a student
export const deleteStudent = async (id) => {
  const result = await pool.query(
    "DELETE FROM students WHERE id =$1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
