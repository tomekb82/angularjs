/// <reference path='../../reference.ts' />

angular.module('myApp')
    .factory('errorHandlerInterceptor', function ($q, $rootScope) {
        return {
            'responseError': function (response) {
			          console.log('errorHandlerInterceptor');
                if (!(response.status == 401 && response.data.path.indexOf("/api/account") == 0 )){
	                $rootScope.$emit('myApp.httpError', response);
	            }
                return $q.reject(response);
            }
        };
    });
