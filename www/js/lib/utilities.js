var url = require('url');

function getSource(link) {
    return url.parse(link,true).host;
}

exports.getSource = getSource;
