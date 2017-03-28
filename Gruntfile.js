'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var sassConfig = {
    default: {
      files: {
        'src/calcApp.css': 'src/calcApp.scss'
      }
    }
  };

  var concatConfig = {
    default: {
      files: {
        'src/script.js': [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/angular/angular.js',
          'src/calcApp.module.js',
          'src/calcCtrl.js'
        ],
        'src/style.css': [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'src/calcApp.css'
        ]
      }
    }
  };

  var uglifyConfig = {
    default: {
      files: {
        'dist/script.min.js': ['src/script.js']
      }
    }
  };

  var cssminConfig = {
    default: {
      files: {
        'dist/style.min.css': ['src/style.css']
      }
    }
  };

  var connectConfig = {
    options: {
      base: 'dist',
      keepalive: true
    },
    server: {
      options: {
        port: process.env.PORT || 9601
      }
    },
    local: {
      options: {
        hostname: 'localhost',
        port: 9601,
        open: true
      }
    }
  };

  var karmaConfig = {
    unit: {
      options: {
        files: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-mocks/angular-mocks.js',
          'src/calcApp.module.js',
          'src/calcCtrl.js',
          'test/**/*.js'
        ],
        singleRun: true,
        browsers: ['PhantomJS2'],
        frameworks: ['jasmine'],
        //plugins: ['karma-jasmine']
      }
    }
  };

  var gruntConfig = {
    sass: sassConfig,
    concat: concatConfig,
    uglify: uglifyConfig,
    cssmin: cssminConfig,
    connect: connectConfig,
    karma: karmaConfig
  };

  grunt.initConfig(gruntConfig);

  grunt.registerTask('build', [
    'sass',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('startlocal', [
    'build',
    'connect:local'
  ]);

  grunt.registerTask('start', [
    'build',
    'connect:server'
  ]);

  grunt.registerTask('test', [
    'karma:unit'
  ]);
};