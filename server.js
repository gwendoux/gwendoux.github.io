//https://www.npmjs.com/package/instagram-node
//http://www.programmableweb.com/news/how-to-create-instagram-photo-printing-app-node.js/how-to/2015/07/23

var express = require ('express');
var nunjucks  = require('nunjucks');
var path = require('path');
var logger = require('morgan');
var config = require('./lib/config');
//var Instagram = require('instagram-node-lib');
var ig = require('instagram-node').instagram();
var bodyParser = require('body-parser');

//Instagram.set('client_id', config.instagram_client_id);
//Instagram.set('client_secret', config.instagram_client_secret);
//Instagram.set('access_token', config.instagram_access_token);

ig.use({
    access_token: config.instagram_access_token,
    client_id: config.instagram_client_id,
    client_secret: config.instagram_client_secret
});

var app = express();
var jsonParser = bodyParser.json();

app.use(logger('dev'));
app.use('/', express.static(__dirname + '/public'));
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.set('port', process.env.PORT || 8014);

app.get('/', function (req, res) {
    res.render('index.html');
});

app.use('/api/photos/:tag', jsonParser, function (req, res) {
    //ig.users(config.instagram_user_id, function(err, result) {
    ig.user_self_media_recent(function(err, result) {
        if(err) {
            console.log(err);
            throw err;
        }
        var coffeeBeans = result.filter(function(photo) {
            return photo.tags.indexOf(req.params.tag) > -1;
        });
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(coffeeBeans, null, 2));
    });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
