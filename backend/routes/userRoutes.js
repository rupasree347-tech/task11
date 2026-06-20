const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");


const {
  getProfile,
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");


// Profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);


// Dashboard Statistics (Admin + Manager)
router.get(
  "/dashboard/stats",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  getDashboardStats
);

// User Management (Admin + Instructor can list; Admin can update/delete)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Instructor"),
  getAllUsers
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Instructor"),
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteUser
);

// ADMIN
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("Admin"),
  (req,res)=>{
    res.json({
      message:"Admin Dashboard"
    });
  }
);


// MANAGER
router.get(
  "/manager",
  authMiddleware,
  roleMiddleware("Manager"),
  (req,res)=>{
    res.json({
      message:"Manager Dashboard"
    });
  }
);


// INSTRUCTOR
router.get(
  "/instructor",
  authMiddleware,
  roleMiddleware("Instructor"),
  (req,res)=>{
    res.json({
      message:"Instructor Dashboard"
    });
  }
);


// STUDENT
router.get(
  "/student",
  authMiddleware,
  roleMiddleware("Student"),
  (req,res)=>{
    res.json({
      message:"Student Dashboard"
    });
  }
);

module.exports = router;
