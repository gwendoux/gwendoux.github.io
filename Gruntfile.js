module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', 'build');

    grunt.registerTask('test', [
    ]);

    grunt.registerTask('css', [
        'less:concat',
        'postcss',
        'clean:postprocess'
    ]);

    /*grunt.registerTask('js', [
        'browserify',
        'uglify',
        'clean:postprocess'
    ]);*/

    grunt.registerTask('build', [
        'clean:build',
        //'jshint:client',
        //'js',
        'css'
    ]);

    grunt.registerTask('start-watch', [
        'jshint:server',
        'nodemon'
    ]);

    grunt.registerTask('build-watch', [
        'build',
        'watch'
    ]);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
            src: 'public'
        },

        jshint: {
            options: {
                unused: 'vars',
                devel: true,
                undef: true,
                ignores: ['dist/**',
                          'node_modules/**',
                          '<%= config.src %>/js/vendors/**',
                          '**/*.min.js'
                         ]
            },
            server: {
                options: {
                    node: true,
                    esnext: true
                },
                files: {
                    src: ['**/*.json', '**/*.js',
                          '!public/js/*.js'
                         ]
                }
            },
            client: {
                options: {
                    browser: true,
                    globals: {
                        require: false,
                        exports: false
                    }
                },
                files: {
                    src: ['<%= config.src %>/js/*.js']
                }
            }
        },

        /*browserify: {
            dist: {
                files: {
                    '<%= config.src %>/js/script.js': ['<%= config.src %>/js/behavior.js'],
                }
            }
        },*/

        /*uglify : {
            options: {
                report: 'gzip',
                beautify: true,
                compress: false
            },
            app: {
                src: [
                  '<%= config.src %>/js/script.js',
                ],
                dest: '<%= config.src %>/js/script.min.js'
            }
        },*/

        less: {
            concat: {
                src: ['<%= config.src %>/less/main.less'],
                dest: '<%= config.src %>/css/main.css'
            }
        },

        postcss: {
            options: {
                map: true,
                report: 'gzip',
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 version', 'ie 9']
                    }),
                    require('csswring')
                ]
            },
            css: {
                src: '<%= config.src %>/css/main.css',
                dest: '<%= config.src %>/css/main.min.css'
            }
        },

        clean: {
            build: {
                src: ['<%= config.src %>/css/*.min.css', '<%= config.src %>/js/*.min.js', '<%= config.src %>/js/*.map.js']
            },
            postprocess: {
                src: ['<%= config.src %>/css/main.css', '<%= config.src %>/js/script.js']
            },
            dist: ['dist']
        },

        connect: {
            server: {
                options: {
                    base: '<%= config.src %>',
                    port: 8014,
                    keepalive: true
                }
            }
        },

        watch: {
            less: {
                files: ['<%= config.src %>/less/**/*.less'],
                tasks: ['css']
            //},
            //js: {
            //    files: ['Gruntfile.js', '<%= config.src %>/js/**/*.js'],
            //    tasks: ['js']
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: ['dev'],
                    nodeArgs: ['--debug'],
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    },
                    cwd: __dirname,
                    ignore: ['node_modules/**', 'Gruntfile.js'],
                    watch: ['server.js'],
                    delay: 1000
                }
            }
        },

        concurrent: {
            target: {
                tasks: ['server', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
};
