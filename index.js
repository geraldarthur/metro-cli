#!/usr/bin/env node

var cl = require('corelocation'),
    wmataClient = require('wmata-client'),
    colors = require('colors'),
    lpad = require('leftpad'),
    request = require('request');

var ll = cl.getLocation();

console.log('searching around ', ll.join(',') + '\n');

var stations = wmataClient.rail.findStop(ll);
var codes = stations.map(function(s) { return s.code; });
var all = request({ uri: 'http://secret-wildwood-1777.herokuapp.com/rail/station/all/prediction', json: true }, function(err, data, body) {
    var valid = [];
    codes.forEach(function(c) {
        valid.push(body[c]);
    });
    valid.forEach(function(v) {
        console.log(v[0].LocationName);
        v.forEach(function(t) {
            var c = {
                RD: 'red',
                GR: 'green',
                YL: 'yellow',
                BL: 'blue'
            }[t.Line];
            console.log('', lpad(t.Min, 4, ' '), ' min ', (c ? t.Line[c] : t.Line), ' → ', t.DestinationName);
        });
        console.log();
    });
});
