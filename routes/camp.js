var express = require("express");
var router = express.Router();
var Camp = require("../models/camp.js");

router.get("/campgrounds",function(req,res){
    Camp.find( {}, function(err,allcampgrounds){
        if(err){
            console.log("SOMETHING WENT WRONG");
        }
        else{
            res.render("campgrounds/index",{campgrounds: allcampgrounds});
        }
    });
});

router.post("/campgrounds",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    var newCamground = {name : name , image : image ,desc:desc,author:author };
    console.log(newCamground);
    Camp.create(newCamground,function(err,a){
        if(err){
            console.log("GO TO HELL");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new",isLoggedIn,function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/campgrounds/:id",function(req, res) {
    Camp.findById(req.params.id).populate("comments").exec(function(err,camp){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{camp:camp});
        }
    });
});

//Edit Route
router.get("/campgrounds/:id/edit",checkCampgroundOwnership,function(req, res) {
   Camp.findById(req.params.id,function(err,foundCampground){
       if(err){
           console.log(err);
       }
       else{
           res.render("campgrounds/edit",{camp:foundCampground});
       }
   });
});

///updare route
router.put("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
    Camp.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Delete Route
router.delete("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
    Camp.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please , Login First");
    res.redirect("/login");
}

function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Camp.findById(req.params.id,function(err, foundCampground) {
           if(err){
               req.flash("error","Something Went Wrong");
               res.redirect("back");
           }
           else{
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               }
               else{
                   req.flash("error","You Don't Have the Permission to do that");
                   res.redirect("back");
               }
           }
        });
    }
    else{
        req.flash("error","You need to Login First");
        res.redirect("back");
    }
}

module.exports = router;