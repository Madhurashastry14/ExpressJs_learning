import pool from "../db.js";
import bcrypt from "bcrypt";
export const createUser = async (name, email, password) => {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users(name,email,password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,password_hash",
    [name, email, password_hash],
  );
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query("SELECT *FROM users WHERE email=$1", [email]);
  return result.rows[0];
};
