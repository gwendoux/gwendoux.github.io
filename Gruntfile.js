module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', 'build');

    grunt.registerTask('test', [
        'jshint'
    ]);

    grunt.registerTask('server', [
        'jshint:server',
        'nodemon'
    ]);

    grunt.registerTask('start', [
        'build',
        'notify:watch',
        'concurrent'
    ]);

    grunt.registerTask('css', [
        'less:concat',
        'autoprefixer:dev',
        'cssmin:compress',
        'clean:postprocess'
    ]);

    grunt.registerTask('js', [
        'browserify',
        'uglify',
        'clean:postprocess'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'jshint:client',
        'js',
        'css',
        'notify:build'
    ]);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
            src: 'www'
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
                    src: ['server.js']
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
                        src: [
                            '<%= config.src %>/js/**/*.js',
                            '!<%= config.src %>/js/vendors/*.js'
                         ]
                }
            }
        },

        browserify: {
            dist: {
                files: {
                    '<%= config.src %>/js/script.js': ['<%= config.src %>/js/behavior.js'],
                }
            }
        },

        uglify : {
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
        },

        less: {
            concat: {
                src: ['<%= config.src %>/less/main.less'],
                dest: '<%= config.src %>/css/main.css'
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 9']
            },
            dev: {
                src: '<%= config.src %>/css/main.css'
            }
        },

        cssmin: {
            compress: {
                options: {
                    report: 'gzip'
                },
                files: {
                    '<%= config.src %>/css/main.min.css':
                    ['<%= config.src %>/css/main.css']
                }
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
                tasks: ['css', 'notify:reload']
            },
            js: {
                files: ['Gruntfile.js', '<%= config.src %>/js/**/*.js'],
                tasks: ['js', 'notify:reload']
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
                    ignore: ['node_modules/**', 'www/**', 'Gruntfile.js'],
                    watch: ['server.js'],
                    delay: 1000
                }
            }
        },

        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        chmod: {
            options: {
                mode: '755'
            },
            www: {
                src: ['<%= config.src %>/**']
            },
            server: {
                src: ['www/**']
            }
        },

        notify: {
            watch: {
                options: {
                    message: 'Lint completed now Watch Less and Uglify tasks',
                }
            },
            reload: {
                options: {
                    message: 'Reload completed',
                }
            },
            build: {
                options: {
                    message: 'Build completed successfully!'
                }
            }
        }

    });
};
