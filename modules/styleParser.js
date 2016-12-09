
module.exports = function(path) {

    var Promise = require('bluebird');
    var fs = require('fs');
    var recursive = require('recursive-readdir');
    var _ = require('lodash');
    var async = require('async');

    var getCssReferencesFromStyle = require('./getCssReferencesFromStyle.js');

    return new Promise(function(resolve, reject) {

        recursive(path, ['.*'], function(err, files) {

            var _queue = [];

            _.forEach(files, function(fpath) {
                _queue.push(function(callback) {
                    if (fpath == "files/scss/_default.scss") {
                        getCssReferencesFromStyle(fpath).then(function(fileInfo) {
                            callback(null, fileInfo);
                        });
                    } else {
                        callback();
                    }
                });
            });

            _.defer(function() {
                async.parallelLimit(_queue, 50, function(err, results) {
                    if (err) throw err;
                    resolve(results);
                });
            });

        });

    });

};