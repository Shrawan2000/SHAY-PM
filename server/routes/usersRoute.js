const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt =require('jsonwebtoken');
const authMiddleware = require("../middleware/authMiddleware");


//new registration
router.post("/register", async (req, res) => {
  try {
    //ckeck if user already exiest
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("user is already exist");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //save user
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "User created Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//Login page
router.post("/login", async (req, res) => {
  try {
    // ckeck if user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("user not Found");
    }


    // if user is active
     if(user.status !== "active"){
      throw new Error("The user account is blocked ,Please contact the Admin")
     }
     
    //compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      throw new Error("invalid password");
    }

    //create and assign token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret , {expiresIn:"2d"});

    // send response

    res.send({
      success: true,
      message: "User logged in Successfully",
      Data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get current user

router.get("/get-current-user", authMiddleware , async (req,res)=>{
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success:true,
      message: "User fetched successfully",
      data: user,
    })
  } catch (error) {
    res.send({
      success:false,
      message: error.message, 
    })
  }
})

// get all users
router.get("/get-users" , authMiddleware , async(req ,res)=>{
  try {
    const users = await User.find()
    res.send({
      success:true,
      message:"Users fetched successfully",
      data:users
    })
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
})

// update user status
router.put("/update-user-status/:id" ,authMiddleware , async(req ,res)=>{
  try {
         await User.findByIdAndUpdate(req.params.id ,req.body)
         res.send({
          success:true,
          message: "User status updated successfully"
         })
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
})
module.exports = router;
