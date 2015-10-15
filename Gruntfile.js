var path = require('path');

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', 'build');

    grunt.registerTask('lint', [
        "jshint"
    ]);

    grunt.registerTask('test', [
        "mochaTest"
    ]);

    grunt.registerTask('css', [
        'less',
        'postcss',
        'uncss',
        'clean:postprocess'
    ]);

    grunt.registerTask('svg', [
        'svgstore',
        'svg2template'
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
        'svg',
        'css'
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
                          '!public/js/**/*.js',
                          '!test/**/*.js'
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
                    src: ['<%= config.src %>/js/lib/*.js']
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    ignoreLeaks: false,
                    require: 'test/coverage/blanket_conf'
                },
                src: ['test/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // To suppress the mocha console output from the coverage
                    // report.
                    quiet: true,
                    captureFile: 'test/coverage/report.html'
                },
                src: ['test/*.js']
            }
        },

        browserify: {
            dist: {
                files: {
                    '<%= config.src %>/js/script.js': ['<%= config.src %>/js/lib/behavior.js'],
                }
            }
        },

        uglify : {
            options: {
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true
                },
                //mangle: true,
                report: 'gzip',
                sourceMap: true,
                screwIE8: true,
                preserveComments: false
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
            },
            resume: {
                src: ['<%= config.src %>/less/resume.less'],
                dest: '<%= config.src %>/css/resume.css'
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
                    require('cssnano')
                ]
            },
            index: {
                src: '<%= config.src %>/css/main.css',
                dest: '<%= config.src %>/css/main.min.css'
            },
            resume: {
                src: '<%= config.src %>/css/resume.css',
                dest: '<%= config.src %>/css/resume.min.css'
            }
        },

        uncss: {
            options: {
                report: 'gzip',
                htmlroot: 'public/', // css path link
            },
            index: {
                options: {
                    ignore:
                    ['.photo-box',
                     '.description',
                     '.block-link',
                     '.smaller',
                     '.image-wrap']
                },
                files: {
                    '<%= config.src %>/css/main.min.css': ['views/index.html']
                }
            },
            resume: {
                files: {
                    '<%= config.src %>/css/resume.min.css': ['views/resume.html']
                }
            }
        },

        svgstore: {
            options: {
                prefix: 'icon-',
                cleanup: true,
                cleanupdefs: true,
                inheritviewbox: true
            },
            index : {
                files: {
                    'public/svg/dist/ss--index-icons.svg':
                    'public/svg/index/*.svg',
                }
            },
            resume : {
                files: {
                    'public/svg/dist/ss--resume-icons.svg':
                    'public/svg/resume/*.svg',
                },
            }
        },

        clean: {
            build: {
                src: ['<%= config.src %>/css/*.min.css', '<%= config.src %>/js/*.min.js', '<%= config.src %>/js/*.map.js']
            },
            postprocess: {
                src: ['<%= config.src %>/css/main.css', '<%= config.src %>/css/resume.css', '<%= config.src %>/js/script.js']
            },
            dist: ['dist']
        },

        // used express server instead
        /*connect: {
            server: {
                options: {
                    base: '<%= config.src %>',
                    port: 8014,
                    keepalive: true
                }
            }
        },*/

        watch: {
            less: {
                files: ['<%= config.src %>/less/**/*.less'],
                tasks: ['css']
            },
            'svg': {
                files: ['<%= config.src %>/svg/**/*.svg', '!<%= config.src %>/svg/*.svg'],
                tasks: ['svg']
            },
            js: {
                files: ['Gruntfile.js', '<%= config.src %>/js/lib/*.js', '!*.min.js'],
                tasks: ['js']
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

    grunt.registerTask('svg2template', function() {
        grunt.file.recurse('public/svg/dist/', function(file) {
            if(path.extname(file) === '.svg') {
                grunt.file.write('views/partials/_' + path.basename(file, '.svg') + '.html', '<span style="width:0;height:0;display:none;visibility:hidden;">' + grunt.file.read(file) + '</span>');
                grunt.log.write(path.basename(file, '.svg') + ".html created");
            }
        });
    });
};
