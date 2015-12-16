var $ = require('jquery');

(function() {
    'use strict';

    $(document).ready(function() {

        var coffeeRq = '/api/photos/coffeeoftheday';

        $.getJSON(coffeeRq).done(function(data) {
            var html = [];
            data = data.slice(0, 4);
            $.each(data, function(key, val) {
                html.push('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">');
                html.push('<div class="photo-box">');
                html.push('<div class="image-wrap">');
                html.push('<img src="' + val.image_standard + '">');
                html.push('</div>');
                html.push('<div class="description">');
                html.push(val.caption);
                html.push('<div class="date">' + val.date + '</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
            });
            $('#instafeed').html(html.join(''));
        }).fail(function(error) {
            $('#instafeed').html('<div class="alert">cannot get data from instagram</div>');
        });

        var feedRq = '/api/feed';

        $.getJSON(feedRq).done(function(data) {
            var html = [];
            $.each(data, function(key, val) {
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
        }).fail(function(error) {
            $('#pinboardfeed').html('<div class="alert">cannot get data from pinboard</div>');
        });

        $('.cover-wrapper').addClass('cover-wrapper-enhanced');
    });
}()); // Immediately-Invoked Function Expression (IIFE)
