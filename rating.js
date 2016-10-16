var mongoose  = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var ratingMovieValidator = [
  validate({
    validator: 'isFloat',
    arguments: [{ min: 0, max: 10 }],
    message: 'Accepted value are between 0 to 10'
  })
];

var Rating = new Schema({
    _user : { type: Schema.ObjectId, ref: 'User' }
  , _movie : { type: Schema.ObjectId, ref: 'Movie' }
  , value : { type: Number, validate: ratingMovieValidator }
});

var Rating =  mongoose.model('Rating',Rating);
module.exports = {
	Rating: Rating
}
