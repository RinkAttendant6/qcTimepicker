/*jslint node: true */
module.exports = function(grunt) {
    'use strict';

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>. | Licensed under the Mozilla Public License, version 2.0 */',
                sourceMap: true,
                preserveComments: 'some',
                mangle: {
                    except: ['jQuery']
                }
            },
            build: {
                files: {
                    'build/qcTimepicker.min.js': ['build/qcTimepicker.js']
                }
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: '*',
                dest: 'build/',
                flatten: true,
                filter: 'isFile'
            }
        }
    });

    grunt.registerTask('deploy', ['copy', 'uglify']);
};