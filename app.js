const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport');
const app = express();
const port = process.env.PORT || 5000;
const db = require('./config/db')
//db connection
mongoose.Promise = global.Promise; 

mongoose.connect(db.mongoURI,{
    useMongoClient: true
})
.then(() =>console.log('MongoDb connected...'))
.catch(err => console.log(err));
 
const ideas = require('./routes/task')
const users = require('./routes/users')
require('./config/passport')(passport);
//handle bars
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname,'public')))
// body parser
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// method over ride

app.use(methodOverride('_method'));

// express-middleware

app.use(session({
    secret:"siva425samba",
    resave: true,
    saveUninitialized:true
}));


//passport middleware session 
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// global varibale

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error');
    res.locals.user =req.user || null;
    next();
});

app.get('/',(req,res) => {
    const title =  `Welcome ${process.env.COMPUTERNAME}`
    res.render("index", {title : title});
})

app.get('/about',(req,res) => {
    res.render("about")
}); 

app.use('/ideas',ideas);
app.use('/users',users);

app.listen(port,() => {
    console.log(`server is running on ${port}`);
}) 