var path = require('path');
var src_dir = path.join(__dirname, '..', '..');
console.log("src_dir:", src_dir);

var patterns = [
    path.join(src_dir, 'server.js'),
    path.join(src_dir, 'lib'),
    path.join(src_dir, 'routes')
];

require('blanket')({
    // Only files that match the pattern will be instrumented
    pattern: patterns
});
