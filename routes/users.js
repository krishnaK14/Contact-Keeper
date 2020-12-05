const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const config=require("config");
const {check, validationResult } = require('express-validator');

const User=require("../models/User");

//@route   POST api/users
//@desc    register a user
//@access  public
router.post("/",
[
    check("name","Please add name").not().isEmpty(),
    check("email","Please add a valid email").isEmail(),
    check("password","Please enter a password with 6 or more characters").isLength({
        min:6})
],
async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
   
    const {name,email,password}=req.body;
    try {
      let user= await User.findOne({email});
      if(user){
          res.status(400).json({msg: "user already exists"})
      }
      //if user does not exist add the user.
      user= new User({
          name,
          email,
          password
      });
      //all fuctions return promises so they use the await syntax.
      //definig salt to for hashing of the password.
      const salt= await bcrypt.genSalt(10);
      //hashing the password by accessing it from the user object.
      user.password= await bcrypt.hash(password,salt);
      //finally we will await the result after hashing to save it into the database.
      await user.save();
      //passing the user id in the payload object to generate a token.
      const payload={
          user:{
              id:user.id
          }
      }
      //generating a token in which we will pass the payload object and jwt secret.
      //finally we will send the token to login the created user or the current user after the authentication is done.
      jwt.sign(payload,config.get("jwtSecret"),{
          expiresIn: 360000
      },(err,token)=>{
        if(err) throw err;
        res.json({token});
      });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;