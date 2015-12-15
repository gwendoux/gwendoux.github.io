var express = require ('express');
var logger = require('loglevel');
var nunjucks  = require('nunjucks');
var morgan = require('morgan');
var path = require('path');

var app = module.exports = express();

app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/public'));
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.set('port', process.env.PORT || 8014);

require('./routes/router');

app.listen(app.get('port'), function() {
    logger.debug('Express server listening on port ' + app.get('port'));
});
