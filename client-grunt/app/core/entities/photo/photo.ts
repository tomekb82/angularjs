'use strict';

angular.module('myApp')
    .config(function ($stateProvider) {
        $stateProvider
/*
        	.state('photos', {
                url: "/photos",
        		parent: 'site',
        		views: {
        			'content@': {
                        templateUrl: 'app/core/photos/photos.view.html'
                	}
        		},
        	})
        	.state('photos.list', {
                url: '/list',
                views: {
            		"content@photos": {
                	    templateUrl: "app/core/photos/photos-list/photos-list.view.html",
                        controller: "photosListCtrl"
                    }
            	}
            })*/

            .state('photo', {
                parent: 'entity',
                url: '/photos',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'myApp.photo.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/core/entities/photo/photos.html',
                        controller: 'PhotoController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('photo');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('photo.detail', {
                parent: 'entity',
                url: '/photo/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'myApp.photo.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/core/entities/photo/photo_detail.html',
                        controller: 'PhotoDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('photo');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Photo', function($stateParams, Photo) {
                        return Photo.get({id : $stateParams.id});
                    }]
                }
            })
            .state('photo.new', {
                parent: 'photo',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'app/core/entities/photo/photo_dialog.html',
                        controller: 'PhotoDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {name: null, opinions: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('photo', null, { reload: true });
                    }, function() {
                        $state.go('photo');
                    })
                }]
            })
            .state('photo.edit', {
                parent: 'photo',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'app/core/entities/photo/photo_dialog.html',
                        controller: 'PhotoDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Photo', function(Photo) {
                                return Photo.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('photo', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
