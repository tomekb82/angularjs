'use strict';

angular.module('myApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('logout', {
                parent: 'account',
                url: '/logout',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/core/main/main.html',
                        controller: 'LogoutController'
                    }
                }
            });
    });
