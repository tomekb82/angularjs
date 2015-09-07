
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
					sourcemap: 'true'
				}
			}
		}
	});
	
	grunt.registerTask("default", ["ts:dev"]);
	
}
