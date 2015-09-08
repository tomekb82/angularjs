
module.exports = function(grunt){
	
	// load the task
	grunt.loadNpmTasks("grunt-ts");

	// Configure grunt here
	grunt.initConfig({
		ts: {
			dev:{
				src: ["app/**/*.ts"],
				html: ["app/**/*.html"],
				reference: "./app/reference.ts" ,
				out: 'app/out.js',
				watch: 'app',
				options: {
					target: 'es5',
					sourcemap: 'true',
					emitDecoratorMetadata: 'true'
				}
			},
			test:{
				src: ["test/**/*.ts"],
				options: {
					target: 'es5',
					sourcemap: 'true',
					emitDecoratorMetadata: 'true'
				}
			}
		},

		jasmine : {
			src : 'test/src/**/*.js',
			options : {
				specs : 'test/specs/**/*.js',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfig: {
						baseUrl: ''	
					}
				}
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'test/src/**/*.js',
				'test/specs/**/*.js'
				],
			options: {
				jshintrc: '.jshintrc'
			}
		}
	});

        grunt.loadNpmTasks('grunt-contrib-jasmine');
        grunt.loadNpmTasks('grunt-contrib-jshint');

        grunt.registerTask("default", ["ts:dev"]);
        grunt.registerTask('test', ['ts:test', 'jshint', 'jasmine']);
	
};
