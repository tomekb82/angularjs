'use strict';

angular.module('myApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'site',
                url: '/',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/core/main/main.html',
                        controller: 'MainController'
                    }
                }
            });
    });
