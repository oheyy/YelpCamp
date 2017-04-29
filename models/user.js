var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
//Deals with the hash, salt 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);