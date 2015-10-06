'use strict';

angular.module('myApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('gallery', {
                parent: 'site',
                url: '/gallery',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'myApp.gallery.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/core/gallery/gallery.html',
                        controller: 'GalleryController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('gallery');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })

    });
