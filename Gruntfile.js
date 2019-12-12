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
				src: ['src/module/js/**.min.js', 'src/module/js/**.min.js.map', 'src/module/css/**.css']
			},
			cleanHtml: {
				src: ['src/**.html', 'src/view/**/**.html']
			},
			cleanTpl: {
				src: ['build/**.tpl', 'build/view/**/**.tpl', 'build/template']
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
				tasks: ['sass:devSass', 'autoprefixer:dev']
			},
			tpl: {
				options: {
					spawn: false,
					livereload: lrPort
				},
				files: ['src/index.tpl', 'src/view/**/**.tpl'],
				tasks: ['br_html']
			},
			template: {
				options: {
					spawn: false,
					livereload: lrPort
				},
				files: ['src/template/**.tpl'],
				tasks: ['br_html']
			},
			html: {
				options: {
					spawn: false,
					livereload: lrPort
				},
				files: ['src/index.html', 'src/view/**/**.html'],
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
				src: ['build/module/js/**.min.js', 'build/module/css/**.css']
			}
		},
		usemin: {
			html: ['build/index.html', 'build/view/**/**.html']
		},
		br_html: {
			dev: {
				files: {
					src: ['src/view/**/**.tpl', 'src/**.tpl'],
					ext: '.html'
				}
			},
			build: {
				files: {
					src: ['build/view/**/**.tpl', 'build/**.tpl'],
					ext: '.html'
				}
			}

		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ie 10']
			},
			dev: {
				files: [{
					expand: true,
					cwd: 'src/module/css',
					src: '**.css',
					dest: 'src/module/css/',
					ext: '.css'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: 'build/module/css/',
					src: '**.css',
					dest: 'build/module/css/',
					ext: '.css'
				}]
			}
		}
	});
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['clean:cleanBuild', 'copy:buildCopy', 'br_html:build', 'clean:cleanTpl', 'babel:buildBabel', 'clean:cleanBabel', 'uglify', 'sass:buildSass', 'autoprefixer:build', 'clean:cleanSass']);
	grunt.registerTask('live', ['br_html:dev', 'babel:devBabel', 'sass:devSass', 'autoprefixer:dev', 'connect', 'watch']);
	grunt.registerTask('cleanDev', ['clean:cleanDev', 'clean:cleanHtml']);
	grunt.registerTask('rev', ['filerev', 'usemin']);
	grunt.registerTask('test', ['br_html']);

};
