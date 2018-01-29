var path = require('path');

try {
    var gulp = require(path.join(process.cwd(), 'gulpfile.js'));
    gulp.start('start');
} catch (exx) {
    console.log(exx);
}
