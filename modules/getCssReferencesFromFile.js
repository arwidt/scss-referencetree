
module.exports = function(path) {

    var Promise = require('bluebird');
    var fs = require('fs');
    var _ = require('lodash');

    return new Promise(function(resolve, reject) {

        fs.readFile(path, 'utf8', function(err, content) {
            if (err) return reject(err);

            // Get the classes
            var regClassesDoubleQuote = / class="([^"]+)"/ig;
            var regClassesSingleQuote = / class='([^']+)'/ig;
            // var regClasses = / class=(["'])([^\1]+?)\1/ig;
            var regIdsDoubleQuote = / id="([^"]+)"/ig;
            var regIdsSingleQuote= / id='([^']+)'/ig;

            // Fetch all classes
            var classes = [];
            var c;
            while (c = regClassesDoubleQuote.exec(content)) {
                classes.push(c[1]);
            }
            while (c = regClassesSingleQuote.exec(content)) {
                classes.push(c[1]);
            }

            // var classes = regClasses.exec(content);
            var ids = [];
            var i;
            while (i = regIdsDoubleQuote.exec(content)) {
                ids.push(i[1]);
            }
            while (i = regIdsSingleQuote.exec(content)) {
                ids.push(i[1]);
            }

            var resp = {
                path: path,
                file: _.last(path.split('/')),
                ids: null,
                classes: null
            };

            if (ids) {
                ids = _.chain(ids)
                    .map(function(i) {
                        i = i.replace(/{%[^%]+%}/ig, "");
                        i = i.replace(/{{[^{]+}}/ig, "");
                        i = i.split(" ");
                        return i;
                    })
                    .flattenDeep()
                    .value();

                resp.ids = ids;
            }

            if (classes) {
                classes = _.chain(classes)
                    .map(function(c) {
                        c = c.replace(/{%[^%]+%}/ig, "");
                        c = c.replace(/{{[^{]+}}/ig, "");
                        c = c.split(" ");
                        return c;
                    })
                    .flattenDeep()
                    .value();

                resp.classes = classes;
            }


            resolve(resp);
        });


    });
};