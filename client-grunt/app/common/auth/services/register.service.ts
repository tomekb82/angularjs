'use strict';

angular.module('myApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });
