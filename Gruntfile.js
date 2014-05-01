/*jslint node: true */
module.exports = function(grunt) {
    'use strict';
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8085
                }
            }
        },
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
                    'build/qcTimepicker.min.js': ['src/qcTimepicker.js']
                }
            }
        },
        jshint: {
            files: ['src/*.js', 'test/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                es3: true,
                forin: true,
                freeze: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: true,
                undef: true,
                strict: true,
                trailing: true,
                browser: true
            }
        },
        qunit: {
            all: {
                options: {
                    urls: ['latest', '2.0.3', '1.11.0', '1.10.2', '1.9.1', '1.8.3', '1.7.2', '1.6.4', '1.5.2', '1.4.4', '1.3.2', '1.2.6'].map(function(version) {
                        return 'http://localhost:<%= connect.server.options.port %>/test/index.html?jquery=' + version;
                    })
                }
            },
            latest: {
                options: {
                    urls: ['latest', '1.11.0'].map(function(version) {
                        return 'http://localhost:<%= connect.server.options.port %>/test/index.html?jquery=' + version;
                    })
                }
            }
        }
    });

    grunt.registerTask('deploy', ['uglify']);
    grunt.registerTask('default', ['uglify', 'jshint']);
    grunt.registerTask('test', ['connect', 'jshint', 'qunit:all']);
    grunt.registerTask('quicktest', ['connect', 'jshint', 'qunit:latest']);

};