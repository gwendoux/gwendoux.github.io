var express = require ('express');
var path = require('path');
var logger = require('morgan');

var app = express();
//var apiRouter = express.Router();

app.use(logger('dev'));
app.set('port', process.env.PORT || 8014);
app.use(express.static(path.join(__dirname, '../www')));



//app.use('/api',apiRouter);


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});