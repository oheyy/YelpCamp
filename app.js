var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment");

//Models for DB
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost/yelp_camp_v12");
mongoose.connect("mongodb://daniel:pacman12@ds119718.mlab.com:19718/yelpcamp");
// mongodb://daniel:pacman12@ds119718.mlab.com:19718/yelpcamp
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seed the database
//seedDB();

// PASSPORT CONFIGURATION (Used for req.user)
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//calls function to every route
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
//appends /campgrounds for campgroundRoutes.js
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});