import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function signupUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      message: "Signup successful.",
      user,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Signup failed.",
      error: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Failed to fetch user.",
      error: error.message,
    });
  }
}