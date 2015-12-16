 "use strict";
 const express = require ('express');
 const logger = require('loglevel');
 const nunjucks  = require('nunjucks');
 const morgan = require('morgan');
 const path = require('path');

 const app = module.exports = express();

 app.use(morgan('dev'));
 app.use('/', express.static(__dirname + '/public'));
 nunjucks.configure(path.join(__dirname, 'views'), {
     autoescape: true,
     express: app
 });

 app.set('port', process.env.PORT || 8014);

 require('./routes/router');

 app.listen(app.get('port'), function() {
     logger.info('Express server listening on port ' + app.get('port'));
 });
