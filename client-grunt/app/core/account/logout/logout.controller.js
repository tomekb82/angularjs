'use strict';

angular.module('myApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
