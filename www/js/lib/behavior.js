'use strict';

var moment = require('moment');
var fetchJsonp = require('fetch-jsonp');
var utilities = require('./utilities');
var config = require('../../../config.json');

var ajax = new XMLHttpRequest();

ajax.open("GET", "svg/ss--index-icons.svg", true);
ajax.send();
ajax.onload = function(e) {
    var div = document.createElement("div");
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
};

var coffeeRq = config.base_url + 'v1/photos/tag/coffeeoftheday';

fetchJsonp(coffeeRq, function(err, data) {
    var $instafeed = document.getElementById('instafeed');
    if(err) {
        $instafeed.innerHTML = '<div class="alert" data-err="'+err+'">cannot get data from instagram</div>';
    }
    var html = [];
    data.slice(0, 6).forEach(function(val) {
        html.push('<div class="photo-box">');
        html.push('<img src="' + val.image.standard + '">');
        html.push('<div class="description">');
        html.push(val.image.caption);
        html.push('<div class="date">' + moment(val.image.date, 'X').fromNow() + '</div>');
        html.push('</div>');
        html.push('</div>');
    });
    $instafeed.innerHTML = html.join('');
});

var feedRq = config.base_url + 'v1/links/';

fetchJsonp(feedRq, function(err, data) {
    var $pinboardfeed = document.getElementById('pinboardfeed');
    if(err) {
        $pinboardfeed.innerHTML = '<div class="alert" data-err="'+err+'">cannot get data from pinboard</div>';
    }
    var html = [];
    data.forEach(function(val) {
        html.push('<div class="reading-list--items">');
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
    html.push('<div class="text-centered pinboard-link">');
    html.push('<button id="show-more-items">Show more items</button>');
    html.push('</div>');
    $pinboardfeed.innerHTML = html.join('');
});


document.getElementById('pinboardfeed').addEventListener('click', function(evt) {
    if (evt.target && evt.target.matches("#show-more-items")) {
        var $pinboardfeed = document.getElementById('pinboardfeed');
        var className = 'hide-items';
        if ($pinboardfeed.classList) {
            $pinboardfeed.classList.remove('hide-items');
        } else {
            $pinboardfeed.className = $pinboardfeed.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }

        var $moreitems  = document.getElementById('show-more-items');
        $moreitems.insertAdjacentHTML('beforebegin', '<a href="https://pinboard.in/u:Gwendoux">View all on Pinboard.in</a>');
        $moreitems.parentNode.removeChild($moreitems);
    }
});

// https://css-tricks.com/the-blur-up-technique-for-loading-background-images/
window.onload = function loadStuff() {
    var img = new Image();
    var header = window.document.querySelector('.cover-wrapper');
    var enhancedClass = 'cover-wrapper-enhanced';

    var bigSrc = (function () {
        var styles = document.styleSheets[0].cssRules;
        var bgDeclaration = (function () {
            var bgStyle, i, l = styles.length;
            for (i=0; i<l; i++) {
                if (styles[i].selectorText && styles[i].selectorText == '.'+enhancedClass) {
                    bgStyle = styles[i].style.backgroundImage;
                    break;
                }
            }
            return bgStyle;
        }());
        return bgDeclaration && bgDeclaration.match(/(?:\(['|"]?)(.*?)(?:['|"]?\))/)[1];
    }());

    img.onload = function () {
        header.className += ' ' +enhancedClass;
    };

    if(bigSrc) {img.src = bigSrc;}
};
