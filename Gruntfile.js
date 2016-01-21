module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', 'availabletasks');

    grunt.initConfig({
        availabletasks: {
            tasks: {
                options: {
                    filter: 'include',
                    tasks: ['renderNunjucks', 'svgstore']
                }
            }
        },

        renderNunjucks: {
            html: {
                options: {
                    baseDir: 'templates/'
                },
                files: [{
                    expand: true,
                    cwd: 'templates/',
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
                    'www/svg/ss--index-icons.svg':
                    'svg/index/*.svg'
                }
            },
            resume : {
                files: {
                    'www/svg/ss--resume-icons.svg':
                    'svg/resume/*.svg'
                }
            }
        }

    });
};
