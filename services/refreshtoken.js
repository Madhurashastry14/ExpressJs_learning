import crypto from "crypto";
import pool from "../db.js";
import { Client } from "pg";

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

export const rotateRefreshToken = async (
  oldTokenHash,
  newTokenHash,
  expiresAt,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `SELECT * FROM refresh_tokens WHERE token_hash=$1 FOR UPDATE`,
      [oldTokenHash],
    );
    const storedToken = result.rows[0];
    if (!storedToken) {
      throw new Error("Refresh token not found");
    }

    if (storedToken.revoked_at) {
      throw new Error("Refresh token already revoked");
    }

    if (new Date(storedToken.expiresAt) <= new Date()) {
      throw new Error("Refresh token expired");
    }

    await client.query(
      `UPDATE refresh_tokens SET revoked_at=CURRENT_TIMESTAMP WHERE id=$1`,
      [storedToken.id],
    );

    await client.query(
      `
      INSERT INTO refresh_tokens
      (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [storedToken.user_id, newTokenHash, expiresAt],
    );
    await client.query("COMMIT");

    return storedToken;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
