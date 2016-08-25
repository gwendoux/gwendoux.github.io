'use strict';

var fetchJsonp = require('fetch-jsonp');
var utilities = require('./utilities');

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

var coffeeRq = utilities.apiBaseUrl() + '/v1/photos/tag/coffeeoftheday';
var feedRq = utilities.apiBaseUrl() + '/v1/links/';
var $instafeed = document.getElementById('instafeed');
var $pinboardfeed = document.getElementById('pinboardfeed');
var $moreitems  = document.getElementById('show-more-items');

fetchJsonp(coffeeRq)
    .then(function(response) {
        return response.json();
    }).then(function(json) {
        var html = [];
        json.slice(0, 6).forEach(function(val) {
            html.push('<div class="photo-box">');
            html.push('<img src="' + val.image.standard + '">');
            html.push('<div class="description">');
            html.push(val.image.caption);
            html.push('<div class="date">' + val.image.since + '</div>');
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
            html.push('<a class="block-link" href="' + val.href + '">');
            html.push('<h4>' + val.description + '</h4>');
            html.push('<p><em>' + val.extended + '</em></p>');
            html.push('<p class="smaller"><em>saved ' + val.since + '</em></p>');
            html.push('<p class="smaller">source: ' + utilities.getSource(val.href) + '</p>');
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

        var linkTo = document.createElement('a');
        var linkToText = document.createTextNode('View all on Pinboard.in');
        linkTo.setAttribute('href', 'https://pinboard.in/u:Gwendoux');
        linkTo.appendChild(linkToText);

        $moreitems.insertAdjacentHTML('beforebegin', linkTo);
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
