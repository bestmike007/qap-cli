'use strict';

var list = require('./shell_select/index')(
    {
        pointer: ' ▸ ',
        pointerColor: 'yellow',
        checked: ' 🔵   ',
        unchecked: ' ⚪️   ',
        checkedColor: 'blue',
        msgCancel: 'No selected options!',
        msgCancelColor: 'orange',
        multiSelect: false,
        inverse: true,
        prepend: true
    }
);

function select(itemArray, cb) {
    itemArray.forEach(function(item) {
        list.option(item);
    });

    list.list();

    var stream = process.stdin;

    list.on('select', function(op) {
        //console.log(op);
        cb(op.value)
        //process.exit(0);
    });

    list.on('cancel', function(options) {
        process.exit(0);
    });

}

exports.select = select;
