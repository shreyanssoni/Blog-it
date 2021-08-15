const express = require('express');
const login = require('./routes/logininfo')
const register = require('./routes/register')
const dashboard = require('./routes/dashboard')
const mongoose = require('mongoose')
const app = express();
const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport');
const Blogs = require('./models/blogs_template')
const Login = require('./models/database')
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo');
const { ensureAuthenticated, forwardAuthenticated } = require('./auth');

require('./passport')(passport);

dotenv.config();

let url = `mongodb://sonishreyans:${process.env.PASSWORD}@cluster0-shard-00-00.ohsn5.mongodb.net:27017,cluster0-shard-00-01.ohsn5.mongodb.net:27017,cluster0-shard-00-02.ohsn5.mongodb.net:27017/BlogData?ssl=true&replicaSet=atlas-lmhwim-shard-0&authSource=admin&retryWrites=true&w=majority`;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'))

app.use(express.static(__dirname + '/public'))

app.use(flash())
app.use(session({
  secret: process.env.SECRET_KEY,
  store: MongoStore.create({mongoUrl: url}),
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()
});

app.set('view engine', 'ejs');


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(()=>{console.log('connected')}, err => {console.log("error" + err)});

app.use('/login', login);
app.use('/register', register)
app.use('/dashboard', dashboard)

app.get('/', forwardAuthenticated, async(req,res)=>{
  try {
  let blogs = await Blogs.find({}).sort({formdate: 'desc'});
  res.render('home', {
    blog: blogs
  });
} catch(e) { console.log(e)}
})

app.get('/logout' , ensureAuthenticated , (req, res) => {
  try {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
  } catch(e) {console.log(e)}
});

app.get('/:name', async(req,res)=>{
  let author = await Login.findOne({userName: req.params.name})
  let blogcontent = await Blogs.find({username: req.params.name}).sort({formdate: 'desc'});
  if(author == null) res.redirect('/')
  else{
  try{ 
    res.render('author', {
      author_name: author.name,
      blogs: blogcontent
    })
  } catch(e) {
    console.log(e)
    res.redirect('/')}
}
})

app.get('/:name/:id', async(req,res)=>{
  let blogs = await Blogs.findById({_id: req.params.id})
  try{
  if(blogs.username === req.params.name){ res.render('home_blog', {
    blog: blogs })
  }} catch(e) {
    console.log(e)
    res.redirect('/')
  }
})


app.listen(process.env.PORT || 3000, ()=> console.log("listening at port..."))