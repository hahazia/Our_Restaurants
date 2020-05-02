var express = require("express");
var router = express.Router();
var Restaurants = require("../models/restaurants");
var middleware = require("../middleware");
var geocoder = require('geocoder');


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/restaurants", function(req, res) {
    Restaurants.find({}, function(err, allRestaurants){
        if(err){
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants: allRestaurants, currentUser: req.user});
        }
    });
});


router.post("/restaurants", middleware.isLoggedIn, function(req, res) {
   
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var cost = req.body.cost;
    // geocoder.geocode(req.body.location, function (err, data) {
    //     if (err || data.status === 'ZERO_RESULTS') {
    //         req.flash('error', 'Invalid address');
    //         return res.redirect('back');
    //     }
    //     var lat = data.results[0].geometry.location.lat;
    //     var lng = data.results[0].geometry.location.lng;
    //     var location = data.results[0].formatted_address;
    var newRestaurants = {name: name, image: image, description: desc, author: author, cost: cost};
    // , location: location, lat: lat, lng: lng};
    // 
    Restaurants.create(newRestaurants, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
     
            res.redirect("/restaurants");//, {restaurant: newlyCreated, currentUser: req.user});
        }
    });
});
// });

// GET requests to /restaurants/new
router.get("/restaurants/new", middleware.isLoggedIn, function(req, res) {
    res.render("restaurants/new", {currentUser: req.user});
});

// SHOW route - shows more info about one restaurants
router.get("/restaurants/:id", function(req, res) {
    // find the restaurants with provided ID
    Restaurants.findById(req.params.id).populate("comments").exec(function(err, foundRestaurants) {
        if (err) {
            console.log(err);
        } else {
            // Render show template
            res.render("restaurants/show", {restaurant: foundRestaurants, currentUser: req.user});
        }
    });
});

// Edit
router.get("/restaurants/:id/edit", middleware.isLoggedIn, middleware.checkRestaurantsOwnership, function(req, res) {
    Restaurants.findById(req.params.id, function(err, foundRestaurants) {
        res.render("restaurants/edit", {restaurant:foundRestaurants, currentUser: req.user});
    });
});
// Update
router.put("/restaurants/:id", middleware.isSafe, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.price, location: location, lat: lat, lng: lng};
    Restaurants.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, restaurant){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/restaurants/" + restaurant._id);
        }
    });
  });
});
// Destroy
router.delete("/restaurants/:id", middleware.isLoggedIn, middleware.checkRestaurantsOwnership, function(req, res) {
    Restaurants.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
        }
    });
});

module.exports = router;