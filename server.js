var express = require ('express');
var path = require('path');
var logger = require('morgan');
var config = require('./config');
var Instagram = require('instagram-node-lib');


function getCoffeeBean() {
    Instagram.set('client_id', config.Instagram.CLIENT_ID);
    Instagram.set('client_secret', config.Instagram.CLIENT_SECRET);
    Instagram.set('access_token', config.Instagram.ACCESS_TOKEN);

    Instagram.users.recent({
        user_id: config.Instagram.User_ID,
        complete: function(data){
            var coffeeBeans = data.filter(function(photo) {
                return photo.tags.indexOf('coffeeoftheday') > -1;
            });

            return coffeeBeans;
        }
    });
}

var app = express();

app.use(logger('dev'));


app.set('port', process.env.PORT || 8014);
app.use(express.static(path.join(__dirname, 'www')));

app.get('/api/coffee', function(req, res) {
    var mycoffee = getCoffeeBean();

    console.log(mycoffee);
    res.send('hello coffee');
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});