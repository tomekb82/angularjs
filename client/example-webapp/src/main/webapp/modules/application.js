/* insert app code here */

/**
 * Bootstraps the example application:
 *  Loads the 'demo' module from 'example-library-js' via RequireJS and instantiates some logic from this library
 */
require(['example-library-js/demo/Hello'], function(Hello) {

    var hello = new Hello("test");
	console.log(hello.name);
});