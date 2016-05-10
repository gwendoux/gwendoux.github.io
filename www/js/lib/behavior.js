'use strict';

var moment = require('moment');
var jsonp = require('jsonp');
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

jsonp(coffeeRq, function(err, data) {
    var $instafeed = document.getElementById('instafeed');
    if(err) {
        $instafeed.innerHTML = '<div class="alert" data-err="'+err+'">cannot get data from instagram</div>';
    }
    var html = [];
    data.slice(0, 6).forEach(function(val) {
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
    $instafeed.innerHTML = html.join('');
});

var feedRq = config.base_url + 'v1/links/';

jsonp(feedRq, function(err, data) {
    var $pinboardfeed = document.getElementById('pinboardfeed');
    if(err) {
        $pinboardfeed.innerHTML = '<div class="alert" data-err="'+err+'">cannot get data from pinboard</div>';
    }
    var html = [];
    data.forEach(function(val) {
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

window.onload = function loadStuff() {
    var win, doc, img, header, enhancedClass;

    win = window;
    doc = win.document;
    img = new Image();
    header = doc.querySelector('.cover-wrapper');
    enhancedClass = 'cover-wrapper-enhanced';

    // Rather convoluted, but parses out the first mention of a background
    // image url for the enhanced header, even if the style is not applied.
    var bigSrc = (function () {
        // Find all of the CssRule objects inside the inline stylesheet
        var styles = document.styleSheets[0].cssRules;
        // Fetch the background-image declaration...
        var bgDecl = (function () {
            // ...via a self-executing function, where a loop is run
            var bgStyle, i, l = styles.length;
            for (i=0; i<l; i++) {
                // ...checking if the rule is the one targeting the
                // enhanced header.
                if (styles[i].selectorText && styles[i].selectorText == '.'+enhancedClass) {
                        // If so, set bgDecl to the entire background-image
                        // value of that rule
                    bgStyle = styles[i].style.backgroundImage;
                        // ...and break the loop.
                    break;
                }
            }
            // ...and return that text.
            return bgStyle;
        }());
            // Finally, return a match for the URL inside the background-image
            // by using a fancy regex I Googled up, as long as the bgDecl
            // variable is assigned at all.
        return bgDecl && bgDecl.match(/(?:\(['|"]?)(.*?)(?:['|"]?\))/)[1];
    }());

    // Assign an onLoad handler to the dummy image *before* assigning the src
    img.onload = function () {
        header.className += ' ' +enhancedClass;
    };
        // Finally, trigger the whole preloading chain by giving the dummy
        // image its source.
    if (bigSrc) {
        img.src = bigSrc;
    }
};
