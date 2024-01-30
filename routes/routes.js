const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const userModel = require("../models/userModel")
const saltRounds = 10

router.get("/log", (req, res) => {
    res.render("log");
});

router.get("/error", (req, res) => {
    res.render("error", {errorType: req.query.errorType});
});

router.get("/sign", (req, res) => {
    res.render("sign");
});

router.get("/subscriptions", async (req, res) => {
    const user = await userModel.findById(req.query.userId)
    res.render("subscriptions", {user : user});
});

router.get("/account/:id", async (req, res) => {
    const user = await userModel.findById(req.params.id)
    res.render("account", {user : user});
});

router.post('/log', async (req, res) => {

    const { userEmail, userPassword } = req.body;
    
    try {
      const user = await userModel.findOne({ userEmail: userEmail });  
  
      if (user) {
        const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
  
        if (passwordMatch) {
          req.session.userId = user.id;
          res.redirect(`/account/${user.id}`);
        } else {
          res.redirect('/error?errorType=passwordMismatch');
        }
      } else {
        res.redirect('/error?errorType=userNotFound');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  });

router.post("/sign", async (req, res) => {
    if(req.body.userPassword != req.body.confirmPassword){
        res.redirect("/error?errorType=Password")
        return
    } 
    if(await userModel.findOne({userEmail: req.body.userEmail})){
        res.redirect("/error?errorType=Email")
        return
    }
    try {
        const newUser = new userModel({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: await hashPassword(req.body.userPassword),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            sex: req.body.sex,
            sub:{
                title: "Free",
                description: "Basic subscription. Allow only to read info on site.",
                price: 0, 
                duration: new Date(),
            }
        });

        await newUser.save();
        res.redirect("/log");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

router.post('/subscribe', async (req, res) => {
    const userId = req.query.userId;
    
    if (!userId) {
        console.log("Session userId is not set.");
        res.redirect('/log');
        return;
    }
  
    const { plan, price, duration, description } = req.body;
  
    try {
        const currentDate = new Date();
        const dueDate = new Date(currentDate.getTime() + duration * 24 * 60 * 60 * 1000);

        await userModel.findByIdAndUpdate(userId, {
            'sub.title': plan,
            'sub.price': price,
            'sub.duration': dueDate,
            'sub.description': description
        });

        res.redirect(`/account/${userId}`);
        } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).send('Internal Server Error');
        }
  });
  

async function hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw error;
    }
  }

module.exports = router;
