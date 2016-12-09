
module.exports = function(path) {

    var Promise = require('bluebird');
    var fs = require('fs');
    var recursive = require('recursive-readdir');
    var _ = require('lodash');
    var getCssReferenceFromFile = require('./getCssReferencesFromFile.js');
    var async = require('async');

    return new Promise(function(resolve, reject) {

        recursive(path, ['.*'], function(err, files) {

            var _queue = [];

            _.forEach(files, function(fpath) {
                _queue.push(function(callback) {
                    // if (fpath == "files/twig/recipe/view/part/profilenavigation/profile-navigation.twig") {
                        getCssReferenceFromFile(fpath).then(function(fileInfo) {

                            // if (fileInfo.id || fileInfo.classes) {
                            //     console.log(fileInfo.path);
                            //     if (fileInfo.ids) console.log("i:", fileInfo.ids);
                            //     if (fileInfo.classes) console.log("c:", fileInfo.classes);
                            // }
                            callback(null, fileInfo);
                        });
                    // } else {
                    //     callback();
                    // }
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