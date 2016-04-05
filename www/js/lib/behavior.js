'use strict';

var $ = require('jquery');
var moment = require('moment');

var utilities = require('./utilities');
var config = require('../../../config.json');

$(document).ready(function() {

    $.get("svg/ss--index-icons.svg", function(data) {
        var div = document.createElement("div");
        div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
        document.body.insertBefore(div, document.body.childNodes[0]);

    });

    var coffeeRq = config.base_url + 'v1/photos/tag/coffeeoftheday';

    $.ajax({
        url: coffeeRq,
        jsonp: 'callback',
        dataType: 'jsonp',
        cache: false,
        success: function(res) {
            var html = [];
            $.each(res.slice(0, 6), function(key, val) {
                html.push('<div class="col-xs-12 col-sm-6 col-md-4">');
                html.push('<div class="photo-box">');
                html.push('<div class="image-wrap">');
                html.push('<img src="' + val.image.standard + '">');
                html.push('</div>');
                html.push('<div class="description">');
                html.push(val.image.caption);
                html.push('<div class="date">' + moment(val.image.date, 'X').fromNow() + '</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
            });
            $('#instafeed').html(html.join(''));
        },
        error: function(err) {
            $('#instafeed').html('<div class="alert">cannot get data from instagram</div>');
        }
    });

    var feedRq = config.base_url + 'v1/links/';

    $.ajax({
        url: feedRq,
        jsonp: 'callback',
        dataType: 'jsonp',
        cache: false,
        success: function(res) {
            var html = [];
            $.each(res, function(key, val) {
                html.push('<div class="col-md-4 col-xs-12 reading-list--items">');
                html.push('<div class="link-wrap">');
                html.push('<a class="block-link" href="' + val.href + '">');
                html.push('<h4>' + val.description + '</h4>');
                html.push('<p><em>' + val.extended + '</em></p>');
                html.push('<p class="smaller"><em>saved ' + moment(val.time).fromNow() + '</em></p>');
                html.push('<p class="smaller">source: ' + utilities.getSource(val.href) + '</p>');
                html.push('</a>');
                html.push('</div>');
                html.push('</div>');
            });
            html.push('<div class="col-md-12 col-xs-12 text-centered pinboard-link">');
            html.push('<button id="show-more-items" class="button">Show more items</button>');
            html.push('</div>');
            $('#pinboardfeed').html(html.join(''));
        },
        error: function(err) {
            $('#pinboardfeed').html('<div class="alert">cannot get data from pinboard</div>');
        }
    });

    $('#pinboardfeed').on('click', '#show-more-items', function() {
        $('.hide-items').removeClass('hide-items');
        $(this).before('<a href="https://pinboard.in/u:Gwendoux">View all on Pinboard.in</a>').remove();
    })

    // find a better way to add this class
    // wait until full image is downloaded and available
    $('.cover-wrapper').addClass('cover-wrapper-enhanced');
});
