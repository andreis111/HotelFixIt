const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/staff");
const { ensureAuth } = require('../middleware/auth')


router.get('/', ensureAuth, tasksController.getStaff)
router.get('/tasksCompleted', ensureAuth, tasksController.getCompleted)

router.post("/createNewTask/", tasksController.createTask);

router.put("/task/markComplete/:id", tasksController.markComplete);



module.exports = router;
