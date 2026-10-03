import crypto from "crypto";
import pool from "../db.js";

//generate refresh token(some random char)
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// hash the refreshtoken so that we can store it in database
export const hashRefreshToken = (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return tokenHash;
};

//save the refreshtoken
export const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
  const result = await pool.query(
    "INSERT INTO refresh_tokens(user_id,token_hash,expires_at) VALUES ($1,$2,$3) RETURNING*",
    [userId, tokenHash, expiresAt],
  );
  return result.rows[0];
};

//find the refresh token from the database
export const findRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    "SELECT *FROM refresh_tokens WHERE token_hash=$1",
    [tokenHash],
  );
  return result.rows[0];
};

//revoke the refresh token
export const revokeRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    "update refresh_tokens SET revoked_at=CURRENT_TIMESTAMP WHERE token_hash=$1 RETURNING *",
    [tokenHash],
  );
  return result.rows[0];
};
