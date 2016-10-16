var mongoose  = require('mongoose');
var validate = require('mongoose-validator');
var emailUserValidator = [
  validate({
    validator: 'isEmail',
    message: 'Should be only Email'
  })
];
  var User =  new mongoose.Schema({
     first: String
   , last: String
   , email: { type: String, unique: true, validate: emailUserValidator }
   , password: { type: String, index: true }
  });
var User =  mongoose.model('User',User);
module.exports = {
	User: User
}
