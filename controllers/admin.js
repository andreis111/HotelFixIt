const Task = require("../models/Task");
const Staff = require("../models/Staff");

module.exports = {

  getAdminMainPage: async (req, res) => {
    try {

      const activeStaff = await Staff.find({ active: true, role: 'staff', adminId: req.user.id })
      const tasks = await Task.find({ completedBy: null, adminId: req.user.id }).sort({ importance: 'asc', createdDate: 'asc' });

      //show task.importance by string, not number
      const importanceMap = {
        1: 'High',
        2: 'Medium',
        3: 'Low'
      }
      tasks.forEach(task => {
        task.importance = importanceMap[task.importance];
      });

      res.render("adminMainPage.ejs", { tasks: tasks, user: req.user, staff: activeStaff });

    } catch (err) {
      console.log(err);
    }
  },

  getStaff: async (req, res) => {
    try {
      // finding all the staff with the associed id
      const staffMembers = await Staff.find({ adminId: req.user.id });

      // rendering profile page with the data from the DB

      res.render("adminStaffMenu.ejs", { staff: staffMembers });

    } catch (err) {
      console.log(err);
    }
  },

  getOngoingTasks: async (req, res) => {
    try {



      //$ne -- 'not equal to'
      const tasks = await Task.find({ completedBy: { $ne: null }, adminId: req.user.id, completed: false }).sort({ importance: 'asc', assignedDate: 'asc' }).populate({ path: 'completedBy', match: { active: true }, options: { sort: { createdDate: 'desc' } } });
      //show task.importance by string, not number
      const importanceMap = {
        1: 'High',
        2: 'Medium',
        3: 'Low'
      }
      tasks.forEach(task => {
        task.importance = importanceMap[task.importance];
      });

      res.render("ongoingTasksAdmin.ejs", { tasks: tasks, user: req.user });

    } catch (err) {
      console.log(err);
    }
  },


  getTasksCompleted: async (req, res) => {
    try {
      //$ne -- 'not equal to'
      const tasks = await Task.find({ completedBy: { $ne: null }, adminId: req.user.id, completed: true }).sort({ importance: 'asc', assignedDate: 'asc' }).populate({ path: 'completedBy', match: { active: true }, options: { sort: { createdDate: 'desc' } } });
      //show task.importance by string, not number
      const importanceMap = {
        1: 'High',
        2: 'Medium',
        3: 'Low'
      }
      tasks.forEach(task => {
        task.importance = importanceMap[task.importance];
      });

      res.render("adminTasksDone.ejs", { tasks: tasks, user: req.user });

    } catch (err) {
      console.log(err);
    }
  },

  assignJob: async (req, res) => {
    try {
      await Task.findOneAndUpdate(
        { _id: req.params.id },
        {
          completedBy: req.body.assign,
          assignedDate: new Date()
        }
      );
      console.log(`Assigned to ${req.body.assign}`);
      res.redirect(`/admin`);
    } catch (err) {
      console.log(err);
    }
  },
};
