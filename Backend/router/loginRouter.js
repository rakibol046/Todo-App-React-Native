const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/People");
const checkLogin = require("../middlewares/auth_guard/checkLogin");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.find({ email: email });

    if (user && user.length > 0) {
      res.status(208).json({
        error: true,
        message: "user already exist",
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      //send otp and then reseponse
      res.status(200).json({
        error: false,
        message: "Signup was successful!",
      });
    }
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});
// SIGNUP OTP
router.post("/signup/otp", async (req, res) => {
  try {
    const { otp, phone } = req.body;

    const user = await User.find({ phone: phone });
    if (user && user.length > 0) {
      //will checking otp is valid or not,if is valid then exicute the code
      let valiedUser = User.findOneAndUpdate(
        { phone: phone },
        { is_verified: true },
        {
          new: true,
        }
      ).select({
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        password: 0,
      });
      // generate token
      const token = jwt.sign(
        {
          phone: user[0].phone,
          userId: user[0]._id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "12d",
        }
      );
      res.status(200).json({
        error: false,
        message: "Validate successfully",
        is_verified: true,
        access_token: token,
        user: valiedUser,
      });
    }
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email }).select({
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    console.log(user);
    if (user && user.length > 0) {
      if (user[0].is_verified) {
        const isValidPassword = await bcrypt.compare(
          req.body.password,
          user[0].password
        );

        if (isValidPassword) {
          // generate token
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "12d",
            }
          );
          let verifiedUser = { ...user[0]._doc };
          delete verifiedUser.password;

          res.status(200).json({
            error: false,
            isVerified: true,
            access_token: token,
            message: "Login successful!",
            user: verifiedUser,
          });
        } else {
          res.status(200).json({
            error: true,
            isVerified: true,
            message: "email and password incorrect!",
          });
        }
      } else {
        res.json({
          error: false,
          is_verified: false,
          message: "Not verified user!",
        });
      }
    } else {
      res.json({
        error: true,
        is_verified: false,
        message: "User not exist!",
      });
    }
  } catch {
    res.status(500).json({
      error: true,
      message: "server side error!",
    });
  }
});

// USER UPDATE
router.patch("/update", checkLogin, async (req, res) => {
  try {
    const _id = req.userId;
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        ...req.body,
        password: hashedPassword,
      };
      const updateUser = await User.findByIdAndUpdate(_id, newUser, {
        new: true,
      }).select({
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        password: 0,
      });
      res.status(200).json({
        error: false,
        message: "Updated successfully",
        user: updateUser,
      });
    } else {
      const updateUser = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
      }).select({
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        password: 0,
      });
      res.status(200).json({
        error: false,
        message: "Updated successfully",
        user: updateUser,
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
