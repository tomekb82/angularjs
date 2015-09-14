/// <reference path='./reference.ts' />

angular.module('myApp',['controllers', 'services', 'directives', 'constants', 'ui.bootstrap', 'ngResource', 'ui.router'])

 .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
		
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'app/common/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            }
        });
		
		});

