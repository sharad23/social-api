module.exports = function(grunt) {

  grunt.initConfig({

    // configure nodemon
    nodemon: {
      dev: {
        script: './bin/www'
      }
    },

    jshint: {
      all: ['schemas/*.js','routes/*.js'] 
    },

    watch: {
      js: {
        files: ['schemas/*.js','routes/*.js'],
        tasks: ['jshint']
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    }   

  });

  // load nodemon
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  // register the nodemon task when we run grunt
  grunt.registerTask('default', ['concurrent']);  

};