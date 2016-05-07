'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('swagger-docs', 'Generate swagger file from annotations', function () {

        var task = this;
        var done = task.async();

        var assert = require('assert');
        var doctrine = require('doctrine');
        var yaml = require('js-yaml');
        var merge = require('merge');
        var swaggerTools = require('swagger-tools');

        var apiDoc = {
            swagger: '2.0',
            info: {
                title: null,
                version: null
            },
            paths: {}
        };

        var parser = {
            parseSwaggerHeader: function (data) {
                merge(apiDoc, data);

                if (!apiDoc.info.version && (/\.json$/).test(task.data.versionFile)) {
                  var versionFile = JSON.parse(grunt.file.read(task.data.versionFile));
                  apiDoc.info.version = versionFile.version;
                }
            },

            parseSwaggerTag: function (data) {
                var tags;

                if (!apiDoc.tags || !apiDoc.tags.length) {
                    apiDoc.tags = [];
                }
                tags = apiDoc.tags;

                Object.keys(data).forEach(function (tagName) {
                    var hasTag,
                        newTag;

                    hasTag = tags.some(function (item) {
                        return (tagName === item.name);
                    });

                    if (!hasTag) {
                        newTag = data[tagName];
                        newTag.name = tagName;
                        tags.push(newTag);
                    }
                });

            },
            parseSwaggerPath: function (data) {
                merge.recursive(apiDoc.paths, data);
            },
            parseSwaggerDefinitions: function (data) {
                if (!apiDoc.definitions) {
                    apiDoc.definitions = {};
                }
                merge(apiDoc.definitions, data);
            }
        };

        function parseControllers() {
            task.filesSrc.forEach(function (f) {
                // Only works with js files, for now
                if ((/\.js$/).test(f)) {
                    readAnnotations(f, function (err, docs) {
                        assert.ifError(err);
                        buildDocs(docs);
                    });
                }
            });
        }

        function readAnnotations(file, fn) {
            var data = grunt.file.read(file);
            var js = data.toString(),
                regex = /\/\*\*([\s\S]*?)\*\//gm,
                fragments = js.match(regex),
                docs = [],
                i,
                fragment,
                doc;

            if (!fragments) {
                fn(null, docs);
                return;
            }

            for (i = 0; i < fragments.length; i += 1) {
                fragment = fragments[i];
                doc = doctrine.parse(fragment, {
                    unwrap: true
                });

                docs.push(doc);

                if (i === fragments.length - 1) {
                    fn(null, docs);
                }
            }
        }

        function buildDocs(fragments) {
            var self = this,
                fn;
            fragments.forEach(function (fragment) {
                fragment.tags.forEach(function (tag) {
                    if (/^Swagger[a-zA-Z]+/.test(tag.title)) {
                        fn = parser['parse' + tag.title];
                        assert.equal(typeof fn, 'function', 'Invalid Section ' + tag.title);
                        try {
                            yaml.safeLoadAll(tag.description, fn.bind(self));
                        } catch (e) {
                            grunt.log.error(e);
                        }
                    }
                });
            });
        }

        function validateApiDoc(cb) {
            swaggerTools.specs.v2.validate(apiDoc, function (err, errDetails) {
                var isValid = errDetails === undefined ? true : false;
                assert.ifError(err);
                cb(isValid, errDetails);
            });
        }

        parseControllers();
        validateApiDoc(function (isValid, errDetails) {
            if (!isValid) {
                grunt.fail.warn("Swagger doc Error.\n" + JSON.stringify(errDetails));
            }
            grunt.file.write(task.files[0].dest, JSON.stringify(apiDoc));
            done();
        });
    });
};
