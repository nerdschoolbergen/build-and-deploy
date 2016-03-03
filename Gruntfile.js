'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var copyConfig = {
    dependencies: {
      files: [
        {
          expand: true,
          cwd: 'bower_components/angular/',
          src: 'angular.js',
          dest: 'src/dependencies/scripts/'
        },
        {
          expand: true,
          cwd: 'bower_components/jquery/dist/',
          src: 'jquery.js',
          dest: 'src/dependencies/scripts/'
        },
        {
          expand: true,
          cwd: 'bower_components/bootstrap/dist/js/',
          src: 'bootstrap.js',
          dest: 'src/dependencies/scripts/'
        },
        {
          expand: true,
          cwd: 'bower_components/bootstrap/dist/css/',
          src: 'bootstrap.css',
          dest: 'src/dependencies/styles/'
        }
      ]
    }
  };

  var sassConfig = {

  };

  var concatConfig = {

  };

  var uglifyConfig = {

  };

  var cssminConfig = {

  };

  var connectConfig = {
    options: {
      port: 9600,
      hostname: 'localhost',
      base: 'src',
      keepalive: true,
      open: true
    },
    serve: {
      options: {
        port: 9601
      }
    }
  };

  var karmaConfig = {
    unit: {
      options: {
        files: [
          'src/dependencies/scripts/jquery.js',
          'src/dependencies/scripts/angular.js',
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
    copy: copyConfig,
    sass: sassConfig,
    concat: concatConfig,
    uglify: uglifyConfig,
    cssmin: cssminConfig,
    connect: connectConfig,
    karma: karmaConfig
  };

  grunt.initConfig(gruntConfig);
};