var $ = require('jquery');
var moment = require('moment');

(function() {
    'use strict';

    $(document).ready(function() {

        var coffeeRq = '/api/photos/coffeeoftheday';

        $.getJSON(coffeeRq, function(data){
            var html = [];
            $.each(data, function(key, val) {
                var formatDate = moment(val.created_time, 'X').format('dddd D MMMM YYYY');
                html.push('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">');
                html.push('<div class="photo-box">');
                html.push('<div class="image-wrap">');
                html.push('<img src="'+val.images.standard_resolution.url+'">');
                html.push('</div>');
                html.push('<div class="description">');
                html.push(val.caption.text);
                html.push('<div class="date">'+formatDate+'</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
            });
            $('#instafeed').html(html.join(''));
        });
    });
}()); // Immediately-Invoked Function Expression (IIFE)
