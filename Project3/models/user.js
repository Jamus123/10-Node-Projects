var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

//user Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  password: {
    type: String, required: true, bcrypt:true
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileimage : {
    type: String
  }
});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.hash(newUser.password, 10, function(error, hash){
    if(error) throw(error);

    //set hashed password
    newUser.password = hash;

    //create User
    newUser.save(callback);
  });
}
