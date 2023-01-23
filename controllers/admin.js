const Task = require("../models/Task");
const Staff = require("../models/Staff");

module.exports = {

  //ADMIN MAIN PAGE
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

  //ADMIN --> STAFF controller
  getStaff: async (req, res) => {
    try {
      // finding all the staff with the associed id
      const activeStaff = await Staff.find({ active: true, role: 'staff', adminId: req.user.id });
      const inactiveStaff = await Staff.find({ active: false, role: 'staff', adminId: req.user.id });

      // rendering profile page with the data from the DB

      res.render("adminStaffMenu.ejs", { activeStaff: activeStaff, inactiveStaff: inactiveStaff });

    } catch (err) {
      console.log(err);
    }
  },

  setInactive: async (req, res) => {
    try {
      await Staff.findOneAndUpdate(
        { _id: req.params.id },
        {
          active: false
        }
      );
      console.log("Staff set to inactive");
      res.redirect(`/admin/staff`);
    } catch (err) {
      console.log(err);
    }
  },

  setActive: async (req, res) => {
    try {
      await Staff.findOneAndUpdate(
        { _id: req.params.id },
        {
          active: true
        }
      );
      console.log("Staff set to active");
      res.redirect(`/admin/staff`);
    } catch (err) {
      console.log(err);
    }
  },
  // deleteStaff: async (req, res) => {
  //   try {
  //     await Staff.deleteOne({ _id: req.params.id })
  //     console.log("staff deleted");
  //     res.redirect("/admin/staff")
  //   } catch (err) {
  //     console.log(err);
  //     res.redirect("/admin/staff");
  //   }
  // },

  // ADMIN --> TASKS controller
  getOngoingTasks: async (req, res) => {
    try {



      //$ne -- 'not equal to'
      const tasks = await Task.find({ completedBy: { $ne: null }, adminId: req.user.id, completed: false }).sort({ importance: 'asc', assignedDate: 'asc' }).populate({ path: 'completedBy', options: { sort: { createdDate: 'desc' } } });
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
      const tasks = await Task.find({ completedBy: { $ne: null }, adminId: req.user.id, completed: true }).sort({ importance: 'asc', assignedDate: 'asc' }).populate({ path: 'completedBy', options: { sort: { createdDate: 'desc' } } });
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

  deleteTask: async (req, res) => {
    try {
      await Task.deleteOne({ _id: req.params.id })
      console.log("Task deleted");
      res.redirect("/admin/")
    } catch (err) {
      console.log(err);
      res.redirect("/admin/");
    }
  },
};
