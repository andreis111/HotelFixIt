const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const adminController = require("../controllers/admin");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//ADMIN ROUTES

router.get("/", ensureAuth, adminController.getAdminMainPage);
router.get("/staff", adminController.getStaff);


//tasks routes
router.get("/ongoingTasks", adminController.getOngoingTasks);
router.get("/tasksCompleted", adminController.getTasksCompleted);
router.post("/createStaff", authController.createStaff);
router.put("/assignJob/:id", adminController.assignJob);
router.delete("/deleteTask/:id", adminController.deleteTask);


//set active/inactive staffs
router.put("/staff/setInactive/:id", adminController.setInactive);
router.put("/staff/setActive/:id", adminController.setActive);

// delete staff - deactivated
// router.delete("/staff/deleteStaff/:id", adminController.deleteStaff);

module.exports = router;