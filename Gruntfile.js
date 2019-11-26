var sass = require('node-sass');
module.exports = function (grunt) {
	var lrPort = 35729;
	var lrSnippet = require('connect-livereload')({port: lrPort});
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var lrMiddleware = function (connect, options) {
		return [
			lrSnippet,
			serveStatic(options.base),
			serveIndex(options.base)
		]
	};
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			cleanBuild: {
				src: 'build'
			},
			cleanBabel: {
				src: 'build/module/js/**.es.js',
			},
			cleanSass: {
				src: 'build/module/css/**.scss'
			},
			cleanDev: {
				src: ['src/module/js/**.min.js','src/module/js/**.min.js.map','src/module/css/**.css']
			}
		},
		copy: {
			buildCopy: {
				files: [{
					expand: true,
					cwd: 'src',
					src: '**',
					dest: 'build'
				}]
			}
		},
		babel: {
			options: {
				presets: ['@babel/preset-env']
			},
			devBabel: {
				options: {
					sourceMap: true,
					presets: ['@babel/preset-env']
				},
				files: [{
					expand: true,
					cwd: 'src/module/js/',
					src: ['**.es.js'],
					dest: 'src/module/js/',
					ext: '.min.js'
				}]
			},
			buildBabel: {
				options: {
					sourceMap: false,
					presets: ['@babel/preset-env']
				},
				files: [{
					expand: true,
					cwd: 'build/module/js/',
					src: ['**.es.js'],
					dest: 'build/module/js/',
					ext: '.min.js'
				}]
			}
		},
		sass: {
			options: {
				implementation: sass,
				sourceMap: false,
				outputStyle: 'compressed',
			},
			buildSass: {
				files: [
					{
						expand: true,
						cwd: 'build/module/css/',
						src: ['**.scss'],
						dest: 'build/module/css/',
						ext: '.css',
					}
				]
			},
			devSass: {
				files: [
					{
						expand: true,
						cwd: 'src/module/css/',
						src: ['**.scss'],
						dest: 'src/module/css/',
						ext: '.css',
					}
				]
			}
		},
		connect: {
			server: {
				options: {
					port: 8889,
					hostname: 'localhost',
					base: './src',
					open: true,
					livereload: lrPort
				}
			}

		},
		livereload: {
			options: {
				open: true,
				middleware: lrMiddleware,
			}
		},
		watch: {
			babel: {
				options: {
					spawn: false,
					livereload: lrPort
				},
				files: ['src/module/js/**.es.js'],
				tasks: ['babel:devBabel']
			},
			scss: {
				options: {
					spawn: false,
					livereload: lrPort
				},
				files: ['src/module/css/**.scss'],
				tasks: ['sass:devSass']
			},
			html: {
				options: {
					spawn: false,
					livereload: lrPort
				},
				files: ['index.html', ['src/**/**.html']],
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'build/module/js',
						src: '**.js',
						dest: 'build/module/js'
					}
				]
			}
		},
		filerev: {
			options: {
				algorithm: 'md5',
				length: 8,
			},
			dist: {
				src: ['build/module/js/**.min.js','build/module/css/**.css']
			}
		},
		usemin: {
			html: ['build/index.html','build/view/**/**.html']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['clean:cleanBuild', 'copy:buildCopy', 'babel:buildBabel', 'clean:cleanBabel', 'uglify', 'sass:buildSass', 'clean:cleanSass']);
	grunt.registerTask('live', ['babel:devBabel', 'sass:devSass', 'connect', 'watch']);
	grunt.registerTask('cleanDev', ['clean:cleanDev']);
	grunt.registerTask('rev', ['filerev','usemin']);

};
