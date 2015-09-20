'use strict';

angular.module('myApp')
    .controller('PhotoDetailController', function ($scope, $rootScope, $stateParams, entity, Photo) {
        $scope.photo = entity;
        $scope.load = function (id) {
	    console.log('PhotoDetailController: load()');
            Photo.get({id: id}, function(result) {
                $scope.photo = result;
            });
        };
        $rootScope.$on('myApp:photoUpdate', function(event, result) {
            $scope.photo = result;
        });
    });
