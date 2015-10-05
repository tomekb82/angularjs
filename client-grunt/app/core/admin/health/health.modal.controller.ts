'use strict';

angular.module('myApp')
    .controller('HealthModalController', function($scope, $modalInstance, currentHealth, baseName, subSystemName) {

        console.log('HealthModalController');
        $scope.currentHealth = currentHealth;
        $scope.baseName = baseName, $scope.subSystemName = subSystemName;

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
