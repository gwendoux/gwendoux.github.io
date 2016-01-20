var path = require('path');

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', 'build');

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
        'renderNunjucks'
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

        renderNunjucks: {
            html: {
                options: {
                    baseDir: 'views/'
                },
                files: [{
                    expand: true,
                    cwd: 'views/',
                    src: ['*.html'],
                    dest: 'www'
                }]
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
                    '<%= config.src %>/svg/dist/ss--index-icons.svg':
                    '<%= config.src %>/svg/index/*.svg'
                }
            },
            resume : {
                files: {
                    '<%= config.src %>/svg/dist/ss--resume-icons.svg':
                    '<%= config.src %>/svg/resume/*.svg'
                }
            }
        },

        clean: {
            build: {
                src: ['<%= config.src %>/js/*.min.js', '<%= config.src %>/js/*.map.js']
            },
            postprocess: {
                src: ['<%= config.src %>/js/script.js']
            }
        },


        watch: {
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
        }
    });

    grunt.registerTask('svg2template', function() {
        grunt.file.recurse('www/svg/dist/', function(file) {
            if (path.extname(file) === '.svg') {
                grunt.file.write('views/partials/_' + path.basename(file, '.svg') + '.html', '<span style="width:0;height:0;display:none;visibility:hidden;">' + grunt.file.read(file) + '</span>');
                grunt.log.write(path.basename(file, '.svg') + ".html created");
            }
        });
    });
};
