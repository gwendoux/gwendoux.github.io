'use strict';

var fetchJsonp = require('fetch-jsonp');
var utilities = require('./utilities');
var moment = require('moment');
/*
** Asynchronously load svg icons
** and insert just after cody element
*/

var ajax = new XMLHttpRequest();

ajax.open("GET", "svg/ss--index-icons.svg", true);
ajax.send();
ajax.onload = function(e) {
    var div = document.createElement("div");
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
};

var coffeeRq = utilities.apiBaseUrl() + '/v2/photos/';
var feedRq = utilities.apiBaseUrl() + '/v2/links/';
var $instafeed = document.getElementById('instafeed');
var $pinboardfeed = document.getElementById('pinboardfeed');

fetchJsonp(coffeeRq)
    .then(function(response) {
        return response.json();
    }).then(function(json) {
        var html = [];
        json.forEach(function(val) {
            html.push('<div class="photo-box">');
            html.push('<img src="' + val.image.url);
            html.push('" width="640" height="640" alt="' + val.caption + '">');
            html.push('<div class="description">');
            html.push(val.caption);
            html.push('<div class="date">' + moment(val.date).fromNow() + '</div>');
            html.push('</div>');
            html.push('</div>');
        });
        $instafeed.innerHTML = html.join('');
    }).catch(function(err) {
        $instafeed.innerHTML = '<div class="alert" data-err="'+err+'">cannot get data from instagram</div>';
    });


fetchJsonp(feedRq)
    .then(function(response) {
        return response.json();
    }).then(function(json) {
        var html = [];
        json.forEach(function(val) {
            html.push('<div class="reading-list--items">');
            html.push('<div class="link-wrap">');
            html.push('<a class="block-link" href="' + val.url + '">');
            html.push('<h4>' + val.title + '</h4>');
            html.push('<p><em>' + val.description + '</em></p>');
            html.push('<p class="smaller"><em>saved ' + moment(val.date).fromNow() + '</em></p>');
            html.push('<p class="smaller">source: ' + utilities.getSource(val.url) + '</p>');
            html.push('</a>');
            html.push('</div>');
            html.push('</div>');
        });
        html.push('<div class="text-centered pinboard-link">');
        html.push('<button id="show-more-items">Show more items</button>');
        html.push('</div>');
        $pinboardfeed.innerHTML = html.join('');
    }).catch(function(err) {
        $pinboardfeed.innerHTML = '<div class="alert" data-err="'+err+'">cannot get data from pinboard</div>';
    });


$pinboardfeed.addEventListener('click', function(evt) {
    if (evt.target && evt.target.matches("#show-more-items")) {
        var className = 'hide-items';
        if ($pinboardfeed.classList) {
            $pinboardfeed.classList.remove('hide-items');
        } else {
            $pinboardfeed.className = $pinboardfeed.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }

        var $moreitems  = document.getElementById('show-more-items');
        var $linkTo = document.createElement('a');
        var linkToText = document.createTextNode('View all on Pinboard.in');
        $linkTo.setAttribute('href', 'https://pinboard.in/u:Gwendoux');
        $linkTo.setAttribute('class', 'btn');
        $linkTo.appendChild(linkToText);

        $moreitems.insertAdjacentElement('beforebegin', $linkTo);
        $moreitems.parentNode.removeChild($moreitems);
    }
});

/*
** Load good quality background image
** https://css-tricks.com/the-blur-up-technique-for-loading-background-images/
*/

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
