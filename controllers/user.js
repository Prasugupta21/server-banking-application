const User = require("../models/user");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res) => {
  try {
    const { name, email,password,accountNumber } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({name,email,password ,accountNumber});
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
  return  res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true,
      user:{
      
      _id:user._id,
      name:user.name,
      email:user.email,
      profilePicture:user.profilePicture
      
      
     } ,token});
     next()
  } catch (error) {
    console.error(error);
  }
}



  
module.exports.Logout=(req,res)=>{
  try {
    res.clearCookie("token")
    .status(200)
    .json({success:true,message:'user logged out successfully'});
  } catch (error) {
 return res.status(500).json({message:'error in logging out',error})
  }
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.getUser = async (req, res) => {
  try {
    const id=req.params.id;
    const user = await User.findById(id);
    if(!user) return   res.status(404).json({ success: false, error:'User not found' });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
