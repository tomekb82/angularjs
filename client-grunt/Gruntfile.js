
module.exports = function(grunt){
	
	// load the task
	grunt.loadNpmTasks("grunt-ts");
	
	// Configure grunt here
	grunt.initConfig({
		ts: {
			dev:{
				src: ["app/**/*.ts"],
				hml: ["app/**/*.html"],
				reference: "./app/reference.ts" ,
				out: 'app/out.js',
				watch: 'app'
			}
		}
	});
	
	grunt.registerTask("default", ["ts:dev"]);
	
}