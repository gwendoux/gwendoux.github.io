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


    grunt.registerTask('build', [
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

        watch: {
            'svg': {
                files: ['<%= config.src %>/svg/**/*.svg', '!<%= config.src %>/svg/dist/*.svg'],
                tasks: ['svg']
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
