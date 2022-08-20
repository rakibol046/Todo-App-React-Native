const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/People");
const Task = require("../models/Task");
const checkLogin = require("../middlewares/auth_guard/checkLogin");


router.get("/incomplete", checkLogin, async (req, res) => {
    let userId = req.userId
    try {
        const task = await Task.find({ user: userId, is_complete: false });
        res.status(200).json({
          error: false,
          message: "Incomplete tasks!",
          task,
        });  
   
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});

router.get("/complete", checkLogin, async (req, res) => {
    let userId = req.userId
    console.log(userId);
    try {
        console.log("ok")
        const task = await Task.find({ user: userId, is_complete: true })
          .select({
            __v: 0,
          })
          .sort({
            createdAt: -1,
          });
         console.log("ok", task);
        res.status(200).json({
          error: false,
          message: "Complete tasks!",
          task,
        });  
   
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});


router.post("/add", checkLogin, async (req, res) => {
    let userId = req.userId
    let info = {
      user: userId,
      text: req.body.text,
    };
    try {
        console.log("ok")
        const newTask = new Task(info);
        const task = await newTask.save();
        res.status(200).json({
          error: false,
          message: "Task added successfull!",
          task,
        });
      
   
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});

router.patch("/complete/:taskId", checkLogin, async (req, res) => {
    const _id = req.params.taskId;
     const userId = req.userId;
    try {
        const task = await Task.find({ user: userId, _id });
        if (task && task.length > 0) {
          await Task.updateOne({ _id }, { is_complete: true});
          res.json({
            error: false,
            message: "task complete!",
          });
        } else {
          res.status(500).json({
            error: true,
            message: "Task not found!",
          });
        }
   
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});
router.post("/delete/:taskId", checkLogin, async (req, res) => {
    const _id = req.params.taskId;
    const userId = req.userId;
    try {
        const task = await Task.find({ user: userId, _id });
        if (task && task.length > 0) {
          await Task.deleteOne({ _id });
          res.json({
            error: false,
            message: "delete successfully!",
          });
        } else {
          res.status(500).json({
            error: true,
            message: "Task not found!",
          });
        }
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});



module.exports = router;
