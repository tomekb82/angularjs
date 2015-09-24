'use strict';

angular.module('myApp').controller('PhotoDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Photo',
        function($scope, $stateParams, $modalInstance, entity, Photo) {

        $scope.photo = entity;
        $scope.load = function(id) {
            Photo.get({id : id}, function(result) {
                $scope.photo = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('myApp:photoUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            console.log("==================  save()");
            if ($scope.photo.id != null) {
                Photo.update($scope.photo, onSaveFinished);
            } else {
                Photo.save($scope.photo, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
