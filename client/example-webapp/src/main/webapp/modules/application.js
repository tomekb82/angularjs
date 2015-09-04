/* insert app code here */

/**
 * Bootstraps the example application:
 *  Loads the 'demo' module from 'example-library-js' via RequireJS and instantiates some logic from this library
 */
require(['example-library-js/Hello'], function(Hello) {

    var hello = new Hello("test");
	console.log(hello.name);

});

require(['example-library-js/Angular'], function(todos) {

	var test = todos.todomvc.test;
	console.log(test);
	
});

