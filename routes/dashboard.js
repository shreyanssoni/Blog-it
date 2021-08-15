const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const methodOverride = require('method-override')
const Blogs = require('./../models/blogs_template')
const { ensureAuthenticated, forwardAuthenticated } = require('../auth');
const { render } = require('ejs');

let full_name;
let userArr;

router.get('/', ensureAuthenticated, async (req,res)=>{
    const login = req.user
    if(userArr != ''){
        userArr = {}
    }
    userArr = {
        full_name: login.name,
        userName: login.userName,
        email: login.email
    } 
    let blogs = await Blogs.find({email: login.email}).sort({formdate: 'desc'})
    res.render('dashboard', {
      full_name: login.name,
      userName: login.userName,
      blogs: blogs
    })
  })

router.get('/new', ensureAuthenticated, (req,res)=> {
    res.render('form')
})

router.get('/:id', ensureAuthenticated, async (req,res)=>{
    const blog = await Blogs.findOne({_id: req.params.id})
    if(blog == null){res.redirect('/dashboard')}
    res.render('blog', {
        blog: blog
    })
})

let d = Date.now();
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
let newdate = mo + " " + da + ", " + ye;

router.post('/new', async (req,res)=>{
    let publish = "false"
    if(req.body.publish == "on"){
        publish = "true"
    }
    const Blog = new Blogs({
        name: userArr.full_name,
        username: userArr.userName,
        email: userArr.email,
        title: req.body.title,
        description: req.body.desc,
        content: req.body.content,
        tags: req.body.tags,
        date: newdate,
        formdate: Date.now(),
        publish: publish
    })
    try{
        // console.log(newBlog)
        await Blog.save();
        res.redirect('/dashboard')
    } catch(e){ 
        console.log(e)
        res.redirect('/dashboard/new')
    }
})

router.get('/:id/edit', ensureAuthenticated, async(req,res) => {
    const Blog = await Blogs.findById({_id: req.params.id})
    res.render('edit', {
        blog: Blog
    })
})

router.put('/:id', ensureAuthenticated, async(req,res) => {
    req.Blog = await Blogs.findById({_id: req.params.id})
    let Blog = req.Blog
    Blog.title = req.body.title
    Blog.description = req.body.desc
    Blog.content = req.body.content
    Blog.tags = req.body.tags
    Blog.publish = "false"
    if(req.body.publish){
        Blog.publish = "true"
    }
    try{
        Blog = await Blog.save()
        res.redirect('/dashboard')
    } catch(e){
        res.redirect(`/dashboard/${req.params.id}/edit`)
        console.log(e)
    }
})

router.delete('/:id',ensureAuthenticated, async(req,res)=> {
    console.log('delete!')
    await Blogs.findByIdAndDelete(req.params.id)
    res.redirect('/');
})

module.exports = router;