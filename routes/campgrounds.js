var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Campground = require("../models/campground");
var geocoder = require("geocoder");
//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            // console.log("Lat: " +data.results[0].geometry.location.lat);
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            // console.log("Lng: " + data.results[0].geometry.location.lng);
            // console.log("Address: " + data.results[0].formatted_address);
            var newCampground = {name: name, image: image, price:price, location: location, lat: lat, lng: lng, description: desc, author:author};
            // Create a new campground and save to DB
            Campground.create(newCampground, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    
                    //redirect back to campgrounds page
                    res.redirect("/campgrounds");
                }
            });
        }
    });

});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //console.log(foundCampground)
            //console.log("The User that is in is: " + req.user.username);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//EDIT and UPDATE ROUTES
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // Is user logged In?
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground});
    });
    // Campground.findById(req.params.id, function(err, foundCampground))
});
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
        if(err){
            console.log(err);
            return res.redirect("/campgrounds")
        }
        else{
            //console.log("Updated Succesffullyy");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err, deleted){
        if(err){
             res.redirect("/campgrounds");
        }
        else{
            //res.redirect to a route
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;