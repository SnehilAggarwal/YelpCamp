var express = require("express");
var router = express.Router();
var Camp = require("../models/camp.js");
var Comment = require("../models/comment.js");

//========================================
//COMMENT ROUTES
//========================================

router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res) {
    Camp.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{camp:camp});
        }
    });
});

router.post("/campgrounds/:id/comments/",isLoggedIn,function(req,res){
    Camp.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id , function(err, comment) {
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/edit",{camp_id:req.params.id,comment:comment});
        }
    });
});

router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment ,function(err,foundComment){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success","Deleted the Comment");
            res.redirect("/campgrounds/"+req.params.id);
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

function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment) {
            if(err){
                req.flash("error","Something Went Wrong");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
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