'use strict';
var $ = require('jquery');
require('fluidbox');

$(document).ready(function() {

    $.get("svg/ss--index-icons.svg", function(data) {
        var div = document.createElement("div");
        div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
        document.body.insertBefore(div, document.body.childNodes[0]);

    });

    var coffeeRq = 'https://api.gwendoux.com/v1/photos/coffeeoftheday';

    $.ajax({
        url: coffeeRq,
        jsonp: 'callback',
        dataType: 'jsonp',
        cache: false,
        success: function(res) {
            var html = [];
            $.each(res.slice(0, 6), function(key, val) {
                html.push('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">');
                html.push('<div class="photo-box">');
                html.push('<div class="image-wrap">');
                html.push('<a data-fluidbox href="' + val.image_standard + '">');
                html.push('<img src="' + val.image_standard + '">');
                html.push('</a></div>');
                html.push('<div class="description">');
                html.push(val.caption);
                html.push('<div class="date">' + val.date + '</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
            });
            $('#instafeed').html(html.join('')).find('a[data-fluidbox]').fluidbox();
        },
        error: function(err) {
            $('#instafeed').html('<div class="alert">cannot get data from instagram</div>');
        }
    });

    var feedRq = 'https://api.gwendoux.com/v1/links/feed';

    $.ajax({
        url: feedRq,
        jsonp: 'callback',
        dataType: 'jsonp',
        cache: false,
        success: function(res) {
            var html = [];
            $.each(res, function(key, val) {
                html.push('<div class="col-md-4 col-xs-12 reading-list">');
                html.push('<div class="link-wrap">');
                html.push('<a class="block-link" href="' + val.url + '">');
                html.push('<h4>' + val.title + '</h4>');
                html.push('<p><em>' + val.desc + '</em></p>');
                html.push('<p class="smaller"><em>saved ' + val.date + '</em></p>');
                html.push('<p class="smaller">source: ' + val.source + '</p>');
                html.push('</a>');
                html.push('</div>');
                html.push('</div>');
            });
            $('#pinboardfeed').html(html.join(''));
        },
        error: function(err) {
            $('#pinboardfeed').html('<div class="alert">cannot get data from pinboard</div>');
        }
    });

    // find a better way to add this class
    // wait until full image is downloaded and available
    $('.cover-wrapper').addClass('cover-wrapper-enhanced');
});
