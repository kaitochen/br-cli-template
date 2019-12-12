/*
 * grunt-br-html
 *
 * Copyright (c) 2019 junkai
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
	var nunjucks = require('nunjucks');
	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks
	grunt.registerMultiTask('br_html', 'The best Grunt plugin ever.', function () {
		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			// Concat specified files.
			var src = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
				return filepath
			});

			// Handle options.
			src.forEach(function (files) {
				var file = grunt.file.read(files);
				var matchResult = file.match(/\{\%.+?\%\}/g);
				var total = file;
				if (matchResult) {
					for (var i = 0; i < matchResult.length; i++) {
						var include = matchResult[i];
						var params = include.replace('{%', '').replace('%}', '');
						var propsArr = params.split(';');
						var props = {};
						for (var j = 0; j < propsArr.length; j++) {
							var key = propsArr[j].split('=')[0];
							var value = propsArr[j].split('=')[1];
							props[key] = value;
						}
						var prefix = 'src/template/';
						var compileTemplate = '';
						if (props.src) {
							var actualLink = prefix + props.src;
							var obj = {};
							if (props.data) {
								obj = JSON.parse(props.data);
							}
							nunjucks.configure({trimBlocks: true, lstripBlocks: true,watch:true});
							compileTemplate = nunjucks.render(actualLink, obj);
							// grunt.log.writeln(compileTemplate);
						}
						total = total.replace(include, compileTemplate);
					}
				}
				var name = files.split('.')[0];
				// grunt.log.writeln(f.ext);
				grunt.file.write(name + '.html', total);
			})
		});
	});

};
