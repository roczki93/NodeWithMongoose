var express = require('express');
var app = express();
//load the main application file//
var api = require(__dirname+'/app/api.js');
app.set('port', (process.env.PORT || 5000));
app.use('/',api);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
