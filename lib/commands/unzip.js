var DecompressZip = require('decompress-zip');
var path = require('path')
var unzipper = new DecompressZip(process.argv[3]);//path to zip file

unzipper.on('error', function(err) {
    console.log('Caught an error:' + JSON.stringify(err));
});

unzipper.on('extract', function(log) {
    //console.log('Finished extracting');
});

unzipper.on('progress', function(fileIndex, fileCount) {
    if (fileIndex % 1000 == 0) {
        process.send(parseInt(fileIndex * 100 / fileCount) + '%');
        // $('.install_text_elapse').text(parseInt(fileIndex * 100 / fileCount) + '%');
        // console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    }
});



unzipper.extract({
    path: process.argv[2]
});
