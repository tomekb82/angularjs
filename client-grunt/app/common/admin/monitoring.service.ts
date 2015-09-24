'use strict';

angular.module('myApp')
    .factory('MonitoringService', function ($rootScope, $http) {
        return {
            getMetrics: function () {
		console.log('MonitoringService: getMetrics()');
                return $http.get('metrics').then(function (response) {
                    return response.data;
                });
            },

            checkHealth: function () {
                return $http.get('health').then(function (response) {
                    return response.data;
                });
            },

            threadDump: function () {
                return $http.get('dump').then(function (response) {
                    return response.data;
                });
            }
        };
    });
