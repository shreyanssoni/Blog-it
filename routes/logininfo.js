const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const LoginInfo = require('./../models/database')
const passport = require('passport')

const { forwardAuthenticated } = require('../auth');

var email = '';

router.get('/', forwardAuthenticated,(req,res)=> {
    res.render( 'login', {
        message: 'nothing here',
        email: email
    });
})

// Login
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next)
    email = req.body.email
});

// Logout
module.exports = router;



// router.post('/',async(req, res, next)=> {
//     const email = await req.body.email;
//     const password = await req.body.password;
//     try {
//     let logindb = await LoginInfo.findOne({email});
//     if(logindb != null && logindb.password === password){
//         initializePassport(passport, logindb, logindb);
//         console.log("sending data..", logindb)
//         passport.authenticate('local', {
//             successRedirect: '/dashboard',
//             failureRedirect: '/',
//             failureFlash: true
//         })(req,res,next)
    // } else {
    //     res.render( 'login', {
    //         message: 'none',
    //         email: email
    //     });
    // }
//     }catch(e){
//         console.log(e);
//     }
    // console.log(email, password)
// })