var url = require('url');

function getSource(link) {
    return url.parse(link,true).host;
}

function apiBaseUrl() {
    return '//api.' + window.location.host;
}

exports.getSource = getSource;
exports.apiBaseUrl = apiBaseUrl;
