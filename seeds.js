var mongoose = require("mongoose");
var Camp = require("./models/camp");
var Comment = require("./models/comment");

var data = [
    {
        name : "Backcountry Camping",
        image : "https://travel.home.sndimg.com/content/dam/images/travel/stock/2016/8/25/0/GettyImages-Education-Images_629563513-Glacier-National-Park-Montana.jpg.rend.hgtvcom.966.644.suffix/1491594368707.jpeg",
        desc : "Serious hikers rave about the looming mountains and alpine lakes that make up Glacier National Park's million-plus acres of natural wonderland. To fully appreciate the park's beauty, load your backpack for a multi-day back-country adventure."
    },
    {
        name : "Rocky Hills",
        image : "https://travel.home.sndimg.com/content/dam/images/travel/stock/2016/8/25/0/GettyImages-Ethan-Miller_589408858_Bryce-Canyon-National-Park.jpg.rend.hgtvcom.966.644.suffix/1491594368639.jpeg",
        desc : "Bryce Canyon National Park is famous for its tall rocky spires known as hoodoos, but its elevation creates 3 unique forest areas. As the park reaches 2,000 feet, there are distinct forest areas with spruce, Ponderosa pines and Pinyon pines."
    },
    {
        name : "Riverside Meditate",
        image :"https://travel.home.sndimg.com/content/dam/images/travel/fullrights/2016/01/14/national-park-camping/camping-voyageurs-national-park-tent.jpg.rend.hgtvcom.966.725.suffix/1491593018595.jpeg",
        desc : "Each site is equipped with a food locker, fire ring and picnic table so you can enjoy dinner under the stars. Be sure to double-check your packing list as there are no nearby shops to pick up forgotten essentials at these isolated camping spots."
    }
    ];

function seedDB(){
    Camp.remove({},function(err){
    if(err){
        console.log(err);
    }
    console.log("Removed Camps");
    data.forEach(function(seed){
        Camp.create(seed,function(err,camp){
            if(err){
                console.log(err);
            }
            else{
                console.log("Added a Camp");
                //Add a Comment
                Comment.create({
                    text : "Hi !! This place is Awesome",
                    author :"Ralph Dibny"
                },function(err,comment){
                    if(err){
                        console.log(err);
                    }
                    else{
                        camp.comments.push(comment);
                        camp.save();
                        console.log("Comment added");
                    }
                })
            }
        })
    })
});
}

module.exports = seedDB;