var path = require('path');

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', 'build');


    grunt.registerTask('css', [
        'less',
        'postcss',
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

    grunt.registerTask('package', [
        'clean:package',
        'build',
        'copy'
    ]);

    grunt.registerTask('build', [
        'clean:build',
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
            src: 'www'
        },

        browserify: {
            dist: {
                files: {
                    '<%= config.src %>/js/script.js': ['<%= config.src %>/js/lib/behavior.js']
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
                    '<%= config.src %>/js/script.js'
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
                    require('csswring')({
                        removeAllComments: true
                    })
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

        svgstore: {
            options: {
                prefix: 'icon-',
                cleanup: true,
                cleanupdefs: true,
                inheritviewbox: true
            },
            index : {
                files: {
                    'www/svg/dist/ss--index-icons.svg':
                    'www/svg/index/*.svg'
                }
            },
            resume : {
                files: {
                    'www/svg/dist/ss--resume-icons.svg':
                    'www/svg/resume/*.svg'
                }
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


        watch: {
            less: {
                files: ['<%= config.src %>/less/**/*.less'],
                tasks: ['css']
            },
            'svg': {
                files: ['<%= config.src %>/svg/**/*.svg', '!<%= config.src %>/svg/dist/*.svg'],
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
        },

        copy: {
            dist: {
                // expand is necessary to get access to advanced Grunt file
                // options such as "cwd".
                expand: true,
                cwd: 'www',
                src:[
                    'css/*',
                    'js/behavior.min.js',
                    'img/*',
                    'fonts/*',
                    'favicon.ico'
                ],
                dest: 'dist/'
            }
        }
    });

    grunt.registerTask('svg2template', function() {
        grunt.file.recurse('www/svg/dist/', function(file) {
            if (path.extname(file) === '.svg') {
                grunt.file.write('server/views/partials/_' + path.basename(file, '.svg') + '.html', '<span style="width:0;height:0;display:none;visibility:hidden;">' + grunt.file.read(file) + '</span>');
                grunt.log.write(path.basename(file, '.svg') + ".html created");
            }
        });
    });
};
