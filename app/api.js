var express = require('express');
var app = express();
var mongoose  = require('mongoose');
var validate = require('mongoose-validator');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser'); 
var urlencodedParser = bodyParser.urlencoded({ limit: '50mb', extended: true })
var session = require('express-session');
//load mongoose schemas//
var User = require('../models/user.js').User;
var Movie = require('../models/movie.js').Movie;
var Rating = require('../models/rating.js').Rating;

//session menagement//
app.use( express.static(__dirname + '/public'), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://shielded-escarpment-26412.herokuapp.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}));
//db connect
mongoose.connect(process.env.MONGODB_URI);

// Autorization it's no seciure! not  use in production! they use to check only value req.session.loggedIn//
var authorize = function(req, res, next) {
 if (req.session && req.session.loggedIn){    
    return next();
 }
 else {
    res.set("Content-Type", "text/html; charset=utf-8");
    return res.send(401);
 }
};
//login url//
app.post('/secret/login', urlencodedParser, function(req, res){
  User.findOne({ email: req.body.user.login, password: req.body.user.password }, function (err, doc) {
    if (err){
      console.log("Problem in loggon proces"+err);
      res.set("Content-Type", "text/html; charset=utf-8");
      res.send(401);
    } 
    if (!doc) {
      console.log("Problem in loggon proces, no user in data");
      res.set("Content-Type", "text/html; charset=utf-8");
      res.send(401);      
    }
    else {
      //save in session user id it isn't seciure method, don't use in production!//
      req.session.loggedIn = doc._id.toString();
      res.set("Content-Type", "text/html; charset=utf-8");
      res.send("Success!");
    }
  }); 
});
//add new user, user can be not logged//
app.post('/m_user', urlencodedParser, function(req, res){    
  res.set("Content-Type", "text/html; charset=utf-8");    
    var user = new User(req.body.user);
  user.save(function (err) {
    if (err) {
      console.log("Problem in add to data"+err);
      res.send(402);
    }else
     res.send("Success!");
  });
});
//update user by id, user can't edit data from other user, user should be logged//
app.put('/m_user', authorize, urlencodedParser, function(req, res){
    res.set("Content-Type", "text/html; charset=utf-8"); 
    req.body.movie.user=req.session.loggedIn;
    mongoose.model('User').findOneAndUpdate({'_id' : req.session.loggedIn}, req.body.user, {upsert: true, runValidators:true},function(err){
     if (err) {
      console.log("Problem with update user data"+err);
      res.send(402);
    }else
      res.send("Success!");
    });
});
//get info about user, user can view information about us, user should be logged//
app.get('/m_user', authorize,function (request, response){
  mongoose.model('User').find({_id: request.session.loggedIn},function(err, user){
    response.send(user);
  });
});
//function calculate avg rating by all movies and add values to movies db//
var agr_rating = function(){
    Rating.aggregate([{ 
      $group : {
          _id : "$_movie",
          rating: { $avg: "$value" }
      }}], function(err,result){
        if(err) {response.send(401);}
        //calculate and add the raiting value to db all movie are updating 
        for(i in result){
          //each calculated value add to movie list
          mongoose.model('Movie').findByIdAndUpdate({'_id' : result[i]._id},{$set: {rating: JSON.stringify(result[i].rating)}}, {upsert: true, runValidators:true},function(err){
           if (err) {
            console.log("Problem with update rating value in Movie data "+err);
            response.send(402);
          }});
        }
      }
    );
}
//add or update if exist rating by move by user, user should be logged//
app.post('/m_movie/rating', authorize, urlencodedParser, function(req, res){
    res.set("Content-Type", "text/html; charset=utf-8"); 
    req.body.rating._user=req.session.loggedIn;
    //if exist value by user to movie we update value
    mongoose.model('Rating').findOneAndUpdate({'_movie' : req.body.rating._movie, '_user' : req.session.loggedIn}, req.body.rating, {upsert: true, runValidators:true},function(err){
      if (err) {
        //else we create value in db and send succes value
        var rating = new Rating(req.body.rating);
        rating.save(function (err) {
          if (err) {
            console.log("Problem with add raiting to movie"+err);
            res.send(402);
          }
          else {
            agr_rating();
            res.send("Success!");
          }
        });
      }
      else {
        agr_rating();
        res.send("Success!");
      }
    });
});
//update movie by id, user can't edit move by other user, user should be logged//
app.put('/m_movie', authorize, urlencodedParser, function(req, res){
    res.set("Content-Type", "text/html; charset=utf-8"); 
    req.body.movie.user=req.session.loggedIn;
    mongoose.model('Movie').findOneAndUpdate({'_id' : req.body.movie.id, 'user' : req.session.loggedIn}, req.body.movie, {upsert: true, runValidators:true},function(err){
     if (err) {
      console.log("Problem with add movie to data"+err);
      res.send(402);
    }else
      res.send("Success!");
    });
});
//delete movie by id, user should be logged//
app.delete('/m_movie/:movieId', authorize, urlencodedParser, function(req, res){
  //if result by search is empty the function also send "succes!//
    mongoose.model('Movie').findOneAndRemove({'_id' : req.params.movieId, 'user' : req.session.loggedIn}, function (err,offer){
      if(err){res.send(402);}
      else{
        mongoose.model('Rating').findOneAndRemove({'_movie' : req.params.movieId}, function (err,offer){
          if(err){res.send(402);}
          else{res.send("Success!");}
        });
      }
    });
});
//add new movie, user should be logged//
app.post('/m_movie', authorize, urlencodedParser, function(req, res){
    // res.set("Content-Type", "text/html; charset=utf-8"); 
    req.body.movie.user=req.session.loggedIn;
    req.body.movie.rating=0; //default
    req.body.movie.createdAt= new Date(); //adding date
    var movie = new Movie(req.body.movie);
    movie.save(function (err) {
    if (err) {
      console.log("Problem with add new movie to data"+err);
      res.send(402);
    }
    else
      res.send("Success!");
    });
});

//get movies by category with sorting by rating default dsc if send params change to asc//
app.get('/m_movie/:category/:sortBy?', function (request, response){
  if(request.params.sortBy){
    mongoose.model('Movie').find({category: request.params.category},null,{sort: {rating: 1}},function(err, movie){
      response.send(movie);
    });
  }
  else {
    mongoose.model('Movie').find({category: request.params.category},null,{sort: {rating: -1}},function(err, movie){
      response.send(movie);
    });  
  }
});
//get all movies with sorting by rating default dsc if send params change to asc//
app.get('/a_movie/:sortBy?', function (request, response){
  if(request.params.sortBy){  
    mongoose.model('Movie').find({},null,{sort: {rating: 1}},function(err, movie){
      response.send(movie);});
  }
  else{
    mongoose.model('Movie').find({},null,{sort: {rating: -1}},function(err, movie){
      response.send(movie);
  });  
  }
});
//list movies by user, list default sorted by rating dsc, when add any value to sortby sorted by rating asc//
app.get('/u_movie/:userId/:sortBy?', function (request, response){
 if(request.params.sortBy){
  mongoose.model('Movie').find({user: request.params.userId},null,{sort: {rating: 1}},function(err, movie){
    response.send(movie);
   });
 }
 else {
  mongoose.model('Movie').find({user: request.params.userId},null,{sort: {rating: -1}},function(err, movie){
    response.send(movie);
   });
 }
});

module.exports = app;