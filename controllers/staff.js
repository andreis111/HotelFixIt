const Task = require("../models/Task");
const Admin = require("../models/Admin");

module.exports = {

  //STAFF MAIN PAGE
  getStaff: async (req, res) => {
    try {
      const tasks = await Task.find({ completedBy: req.user.id, completed: false }).sort({ createdAt: "asc" });


      res.render("staffMainPage.ejs", { tasks: tasks, user: req.user, success_msg: '' })

    } catch (err) {
      console.log(err);
    }
  },

  getCompleted: async (req, res) => {
    try {
      const tasks = await Task.find({ completedBy: req.user.id, completed: true }).sort({ createdAt: "asc" });
      const importanceMap = {
        1: 'High',
        2: 'Medium',
        3: 'Low'
      }
      tasks.forEach(task => {
        task.importance = importanceMap[task.importance];
      });

      res.render("completedTasksStaff.ejs", { tasks: tasks, user: req.user, success_msg: '' })

    } catch (err) {
      console.log(err);
    }
  },
  //MARK COMPLETE TASKS
  markComplete: async (req, res) => {
    try {
      await Task.findOneAndUpdate(
        { _id: req.params.id },
        {
          completed: true,
          completedDate: new Date()
        }
      );
      console.log("Marked Complete");
      res.redirect(`/staff/`);
    } catch (err) {
      console.log(err);
    }
  },

  createTask: async (req, res) => {
    const tasks = await Task.find({ completedBy: req.user.id, completed: false }).sort({ createdAt: "asc" });
    try {
      await Task.create({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        importance: req.body.importance,
        category: req.body.category,
        createdDate: new Date(),
        completed: false,
        adminId: req.user.adminId
      })
      console.log('Task has been added!')
      res.render('staffMainPage', { success_msg: 'Task has been added!', user: req.user, tasks: tasks })
    } catch (err) {
      console.log(err)
    }
  },

};
