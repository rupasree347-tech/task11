const pool = require("../config/db");

const ALLOWED_ROLES = ["Admin", "Manager", "Instructor", "Student"];

exports.getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
      id,
      name,
      email,
      role,
      last_login,
      status
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.getDashboardStats = async (req, res) => {

  try {

    // Total Users
    const totalUsers = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    // Active Users
    const activeUsers = await pool.query(
      "SELECT COUNT(*) FROM users WHERE status='Active'"
    );

    // Users By Role
    const usersByRole = await pool.query(
      `
      SELECT role,
      COUNT(*) as count
      FROM users
      GROUP BY role
      `
    );

    // Login Statistics
    const loginStats = await pool.query(
      `
      SELECT COUNT(*) as total_logins
      FROM login_history
      `
    );

    res.status(200).json({
      success: true,

      totalUsers:
      totalUsers.rows[0].count,

      activeUsers:
      activeUsers.rows[0].count,

      usersByRole:
      usersByRole.rows,

      totalLogins:
      loginStats.rows[0].total_logins
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ==========================================
// GET /users - List all users (Admin only)
// ==========================================
exports.getAllUsers = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
      id,
      name,
      email,
      role,
      status,
      last_login,
      created_at
      FROM users
      ORDER BY id ASC
      `
    );

    res.status(200).json({
      success: true,
      users: result.rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// PUT /users/:id - Update role/status (Admin only)
// ==========================================
exports.updateUser = async (req, res) => {

  try {

    const { id } = req.params;
    const { name, role, status } = req.body;

    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`
      });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        status = COALESCE($3, status)
      WHERE id = $4
      RETURNING id, name, email, role, status, last_login, created_at
      `,
      [name, role, status, id]
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// DELETE /users/:id - Remove a user (Admin only)
// ==========================================
exports.deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    if (req.user.id === parseInt(id, 10)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account"
      });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
