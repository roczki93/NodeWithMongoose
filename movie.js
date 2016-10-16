var mongoose  = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var titleMovieValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between 3 and 50 characters'
  }),
  validate({
    validator: 'isAlpha',//default accepted en alphabet only
    passIfEmpty: true,
    message: 'Name should contain alpha characters only'
  })
];

var Movie =  new mongoose.Schema({
    user: { type: Schema.ObjectId, ref: 'User' }
  , title: {type: String, required: true, validate: titleMovieValidator }
  , rating: { type: Number, default: 0}
  , director: String
  , actors: String
  , category: String
  , createdAt: String
});
var Movie =  mongoose.model('Movie',Movie);
module.exports = {
	Movie: Movie
}
