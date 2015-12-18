'use strict';
const parser = require('parse-rss');
const moment = require('moment');
const config = require('../lib/config');
const url = require('url');
const escape = require('escape-html');

const logger = config.getLogger();
const Pinboard_data = config.get('pinboard_feed_url');


function feed(req, res, data) {
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
}

exports.feed = feed;
