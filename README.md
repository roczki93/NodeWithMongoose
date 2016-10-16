# NodeJS + Express + Mongoose Rest API on Heroku

This application was created based on node-js-getting-started.

# Rest Api
```sh
//login url//
POST-> /secret/login
    example post: user[login]=user&user[password]=user
//add new user, user doesn’t have to be logged in//
POST->/m_user
    example post: user[email]=new@new.new&user[password]=new&user[first]=New&user[last]=new
//update user data//
PUT-> /m_user
    example put: user[email]=new2@new2.new2&user[password]=new2&user[first]=New2&user[last]=new2
//get info about user, user can view information about us, user must be logged in//
GET->/m_user
    example url: https://serene-sands-56313.herokuapp.com/m_user
//add or update movie rating,  user must be logged in//
POST->/m_movie/rating
    example post: rating[_movie]=58037acd472ab800033d32c4&rating[value]=10    
//update movie by id, user can edit only own movies, user must be logged in//
PUT->/m_movie
    example pud: movie[title]=Example&movie[rating]=10&movie[director]=1&movie[actors]=1&movie[category]=1&movie[createdAt]=1
       title acceptet only letters, min size 3, max size 50
       rating is calculate, default value 0 
       createdAt default = time now       
//delete movie by id, user can delete only own movies, user must be logged in//
DELETE->/m_movie/:movieId
    example url: /m_movie/580332e3026cf80003cb46c8
//add new movie, user must be logged in//
POST->/m_movie
    example post: movie[title]=title&movie[rating]=any&movie[director]=any&movie[actors]=any&movie[category]=any&movie[createdAt]=202020
//get movies by category with sorting by rating default dsc, if send params change to asc//
GET->/m_movie/:category/:sortBy?
    example url: https://serene-sands-56313.herokuapp.com/m_movie/D
                 https://serene-sands-56313.herokuapp.com/m_movie/D/asc
//get all movies with sorting by rating default dsc, if send params change to asc//
GET->/a_movie/:sortBy?
    example url: https://serene-sands-56313.herokuapp.com/a_movie
                 https://serene-sands-56313.herokuapp.com/a_movie/asc
//list movies by user, sorted by rating dsc, if send params change to asc//
GET->/u_movie/:userId/:sortBy?
    example url: https://serene-sands-56313.herokuapp.com/u_movie/5802a1cf3287f70003d913f3
                 https://serene-sands-56313.herokuapp.com/u_movie/5802a1cf3287f70003d913f3/asc
```

## Running Locally

Make sure you have Node.js and the Heroku Toolbelt installed. Check: https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction

```sh
$ git clone https://github.com/roczki93/NodeWithMongoose.git
$ cd NodeWithMongoose
$ npm install
$ npm start
```
Your app should now be running on [localhost:5000](http://localhost:5000/).
## Todo List
-create unit tests

-add advanced authentification method

-change structure files 
