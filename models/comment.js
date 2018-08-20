var mongoose = require("mongoose");

var commentScehma = {
    text : String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        },
        username : String
    }
};

module.exports = mongoose.model("Comment",commentScehma);