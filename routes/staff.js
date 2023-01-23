const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/staff");
const { ensureAuth } = require('../middleware/auth')

router.get("/createNewTask", tasksController.getCreateTask);
router.get('/', ensureAuth, tasksController.getStaff)

router.post("/createNewTask/", tasksController.createTask);

router.put("/task/markComplete/:id", tasksController.markComplete);



module.exports = router;
