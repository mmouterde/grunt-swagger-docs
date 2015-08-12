'use strict';

module.exports = function (grunt) {

    grunt.loadTasks('./tasks');

    grunt.initConfig({
        'swagger-docs': {
            dev: {
                src: "fixtures/**/*.js",
                dest: "swagger.json"
            }
        }
    });

    grunt.registerTask('default', 'swagger-docs');

};
