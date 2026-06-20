const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ALLOWED_ROLES = ["Admin", "Manager", "Instructor", "Student"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // -------- Input Validation --------
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are all required",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users
      (name,email,password,role)
      VALUES($1,$2,$3,$4)`,
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const user = result.rows[0];

    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "This account is inactive. Please contact an administrator.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    // Record login history
    await pool.query(
      `
      INSERT INTO login_history
      (user_id)
      VALUES($1)
      `,
      [user.id]
    );

    // Track the active session
    await pool.query(
      `
      INSERT INTO sessions
      (user_id, token)
      VALUES($1, $2)
      `,
      [user.id, token]
    );

    // Update last_login timestamp
    await pool.query(
      `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [user.id]
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      // Avoid leaking whether the email exists
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset token has been generated"
      });
    }

    const user = result.rows[0];

    const resetToken = jwt.sign(
      {
        id: user.id
      },
      process.env.RESET_SECRET,
      {
        expiresIn: process.env.RESET_TOKEN_EXPIRES_IN || "15m"
      }
    );

    // NOTE: In production this token should be emailed to the user
    // rather than returned in the API response.
    res.json({
      success: true,
      message: "Reset token generated",
      resetToken
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

exports.resetPassword = async (req, res) => {

  try {

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.RESET_SECRET
    );

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await pool.query(
      `
      UPDATE users
      SET password=$1
      WHERE id=$2
      `,
      [
        hashedPassword,
        decoded.id
      ]
    );

    res.json({
      success: true,
      message: "Password Reset Successful"
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Invalid or Expired Token"
    });

  }

};

exports.logout = async (req, res) => {

  try {

    const token =
    req.headers.authorization
      .split(" ")[1];

    await pool.query(
      `
      DELETE FROM sessions
      WHERE token = $1
      `,
      [token]
    );

    res.json({
      success: true,
      message: "Logout Successful"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};
