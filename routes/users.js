const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); 
const user = require('../models/users')
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login',(req,res) => {
    res.render('users/login')
});

router.get('/register',(req,res) => {
    res.render('users/register');
});

// login
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect: 'users/login',
        failureFlash: true
    })(req,res,next);
});


// register

router.post('/register',(req,res) => {
    
    let errors = [];

    if(req.body.password != req.body.password2) {
        errors.push({text: 'Password do not match'})
    }

    if(req.body.password.length < 4) {
        errors.push({text: 'Password must contain more then 4 characters'})
    }

    if(errors.length > 0 ) {
        res.render('users/register', {
            errors: errors,
            name:req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else  { 
        const User = new user ({
            name : req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,10)
        }); 
   
    User.save()
    .then( user => {
        req.flash('success_msg','Registed Successfully.');
            res.redirect('/users/login')
        })
    .catch(err => {
        console.log("errior",err);
        return;
    })
}

   
})

router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg','You are Logedout')
    res.redirect('/users/login')
})
module.exports = router;