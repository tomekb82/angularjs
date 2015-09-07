/// <reference path='_all.ts' />

/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
export module todos {
    'use strict';

    var todomvc = angular.module('todomvc', []);
	todomvc.value("test", "dsds");
          //  .controller('todoCtrl', TodoCtrl)
          //  .directive('todoBlur', todoBlur)
          //  .directive('todoFocus', todoFocus);
          //  .service('todoStorage', TodoStorage);
		  
}

