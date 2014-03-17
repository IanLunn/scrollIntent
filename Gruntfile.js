module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
          options: {
            preserveComments: 'some'
          },
          my_target: {
            files: {
              'js/scrollIntent-min.js':
                ['js/scrollIntent.js']
            }
          }
        },

        watch: {
          options: {
            livereload: true,
          },

          scripts: {
            files: ['js/scrollIntent.js'],
            tasks: ['uglify'],
            options: {
              spawn: false
            }
          },

          files: {
            files: ['*.html', '**/*.html'],
            options: {
              spawn: false
            }
          }
        },

        connect: {
          server: {
            options: {
              port: 8000,
              base: './'
            }
          }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['connect', 'watch']); //watch for local development
    grunt.registerTask('run', ['uglify']); //manual compile
};
