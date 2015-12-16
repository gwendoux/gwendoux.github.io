"use strict";
const express = require ('express');
const config = require('../lib/config');
const nunjucks  = require('nunjucks');
const morgan = require('morgan');
const path = require('path');

const logger = config.getLogger();

const app = module.exports = express();

app.use(morgan('dev'));
app.use('/', express.static('www'));
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.set('env', config.get('env'));
app.set('port', process.env.PORT || config.get('port'));

require('./routes/router');

app.listen(app.get('port'), function() {
    logger.info('Express server listening on port ' + app.get('port'));
});
