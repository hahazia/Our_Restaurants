var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    cookieParser    = require("cookie-parser"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Restaurants      = require("./models/restaurants"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

require('dotenv').load()

// Requiring routes
var commentRoutes       = require("./routes/comments"),
    restaurantsRoutes    = require("./routes/restaurants"),
    indexRoutes         = require("./routes/index"),
    passwordRoutes      = require("./routes/password");

//mongoose.connect((process.env.DATABASEURL), { useNewUrlParser: true });
mongoose.connect("mongodb+srv://hahazia:1234567li@cluster0-4po0a.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true} );

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

// PASSPORT CONGIFURATION
app.use(require("express-session")({
    secret: "ourRestaurants is the number one website",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(commentRoutes);
app.use(restaurantsRoutes);
app.use(passwordRoutes);

//================== Fire up the app! ===================
/*app.set('port', 8080);
app.listen(app.get('port'))*/


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Our restaurants has Started");
})
