"use strict";

const app = require('../app');
const config = require('../../lib/config');

const ig = require('instagram-node').instagram();
const escape = require('escape-html');
const moment = require('moment');
const parser = require('parse-rss');
const url = require('url');
const bodyParser = require('body-parser');

const logger = config.getLogger();

ig.use({
    access_token: config.get('instagram_ACCESS_TOKEN'),
    client_id: config.get('instagram_CLIENT_ID'),
    client_secret: config.get('instagram_CLIENT_SECRET')
});

const Pinboard_data = config.get('pinboard_feed_url');

const jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/resume', function(req, res) {
    res.render('resume.html');
});

app.use('/likes/', function(req, res) {
    ig.user_self_liked(function(err, data) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        res.render('likes.html', {data: data});
    });
});

app.use('/api/photos/:tag', jsonParser, function(req, res) {
    ig.user_self_media_recent(function(err, result) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        let coffeeBeans = result.filter(function(photo) {
            return photo.tags.indexOf(req.params.tag) > -1;
        }).map(function(photo) {
            return {
                image_standard: photo.images.standard_resolution.url,
                caption: escape(photo.caption.text),
                date: moment(photo.created_time, 'X').fromNow()
            };
        });
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(coffeeBeans, null, 2));
    });
});

app.use('/api/feed', jsonParser, function(req, res) {
    parser(Pinboard_data, function(err, json) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        let dataFeed = json.slice(0, 3).map(function(json) {
            return {
                title: escape(json.title),
                desc: escape(json.description),
                url: json.link,
                date: moment(json.date).fromNow(),
                source: url.parse(json.link,true).host
            };
        });
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(dataFeed, null, 2));
    });
});

app.use('/api/likes/', jsonParser, function(req, res) {
    ig.user_self_liked(function(err, data) {
        if (err) {
            logger.debug(err);
            throw err;
        }
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(data, null, 2));
    });
});
