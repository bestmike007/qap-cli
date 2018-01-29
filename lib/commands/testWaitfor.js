var fs = require('fs');
fs.writeFile("/Users/xiaoming/qap_project/11111/22.txt", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

}); 

console.log('fffffffffff');
process.on('message', function(m) {
    // Do work  (in this case just up-case the string
    m = m.toUpperCase();

    // Pass results back to parent process
    process.send(m.toUpperCase(m));
});

// function tttt() {
//     var wait = require('wait.for');
//     function anyStandardAsync(param, callback) {
//         setTimeout(function() {
//             callback(null, 'hi ' + param);
//         }, 3000);
//     };

//     function testFunction() {
//         console.log('fiber start');
//         var result = wait.for(anyStandardAsync, 'test');
//         console.log('function returned:', result);
//         console.log('fiber end');
//     };

//     console.log('app start');
//     wait.launchFiber(testFunction);
//     console.log('after launch');
// }

exports.run = tttt;
