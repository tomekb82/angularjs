/// <reference path='../../reference.ts' />

angular.module('myApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-myApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-myApp-params')});
                }
                return response;
            },
        };
    });
