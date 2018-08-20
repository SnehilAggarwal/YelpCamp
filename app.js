var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var localStratergy = require("passport-local");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var User = require("./models/user.js");
var Camp = require("./models/camp.js");
var Comment = require("./models/comment.js");
var seedDB = require("./seeds");
var methodOverride = require("method-override");
var campRoutes = require("./routes/camp.js");
var commentRoutes = require("./routes/comment.js");
var indexRoutes = require("./routes/index.js");

//FLASH CONFIGURATION
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "Again Barry Allen is Flash",
    resave : false ,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//seedDB();
mongoose.connect("mongodb://snehil:goodboy1@ds125272.mlab.com:25272/yelpcamp12345",{ useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(methodOverride("_method"));

app.use(campRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.get("/",function(req,res){
    res.render("landing");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp has Started");
});