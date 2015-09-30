var express = require ('express');
var nunjucks  = require('nunjucks');
var path = require('path');
var url = require('url');
var morgan = require('morgan');
var logger = require('loglevel');
var moment = require('moment');
var config = require('./lib/config');
var ig = require('instagram-node').instagram();
var parser = require('parse-rss');
var bodyParser = require('body-parser');

ig.use({
    access_token: config.instagram_access_token,
    client_id: config.instagram_client_id,
    client_secret: config.instagram_client_secret
});

var app = express();
var jsonParser = bodyParser.json();

app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/public'));
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.set('port', process.env.PORT || 8014);

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/resume', function (req, res) {
    res.render('resume.html');
});

app.use('/likes/', function (req, res) {
    ig.user_self_liked(function(err, data){
        if(err) {
            console.log(err);
            throw err;
        }
        res.render('likes.html', {data: data});
    });
});

app.use('/api/photos/:tag', jsonParser, function (req, res) {
    ig.user_self_media_recent(function(err, result) {
        if(err) {
            console.log(err);
            throw err;
        }
        var coffeeBeans = result.filter(function(photo) {
            return photo.tags.indexOf(req.params.tag) > -1;
        }).map(function(photo) {
            return {
                image_standard: photo.images.standard_resolution.url,
                caption: photo.caption.text,
                date: moment(photo.created_time, 'X').fromNow()
            };
        });
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(coffeeBeans, null, 2));
    });
});

app.use('/api/feed', jsonParser, function (req, res) {
    parser(config.pinboard_feed,function(err, json) {
        if(err) {
            logger.debug(err);
            throw err;
        }
        var dataFeed = json.slice(0, 3).map(function(json) {
            return {
                title: json.title,
                desc: json.description,
                url: json.link,
                date: moment(json.date).fromNow(),
                source: url.parse(json.link,true).host
            };
        });
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(dataFeed, null, 2));
    });
});

app.use('/api/likes/', jsonParser, function (req, res) {
    ig.user_self_liked(function(err, data){
        if(err) {
            console.log(err);
            throw err;
        }
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(data, null, 2));
    });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
