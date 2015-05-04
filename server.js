var express = require ('express');
var path = require('path');
var logger = require('morgan');
var config = require('./config');
var Instagram = require('instagram-node-lib');
var bodyParser = require('body-parser');


Instagram.set('client_id', config.Instagram.CLIENT_ID);
Instagram.set('client_secret', config.Instagram.CLIENT_SECRET);
Instagram.set('access_token', config.Instagram.ACCESS_TOKEN);

var app = express();
var jsonParser = bodyParser.json();

app.use(logger('dev'));


app.set('port', process.env.PORT || 8014);
app.use(express.static(path.join(__dirname, 'www')));

app.use('/api/photos/:tag', jsonParser, function (req, res) {
    Instagram.users.recent({
        user_id: config.Instagram.User_ID,
        complete: function(data){
            var coffeeBeans = data.filter(function(photo) {
                return photo.tags.indexOf(req.param('tag')) > -1;
            });
            res.setHeader('Content-Type', 'text/plain');
            res.end(JSON.stringify(coffeeBeans, null, 2));
        }
    });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
