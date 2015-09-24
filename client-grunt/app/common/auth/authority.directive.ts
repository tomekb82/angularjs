/// <reference path='../../reference.ts' />

angular.module('myApp')
    .directive('hasAnyRole', ['Principal', function (Principal){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var setVisible = function () {
                        console.log('hasAnyRole, setVisible');
                        element.removeClass('hidden');
                    },
                    setHidden = function () {
			console.log('hasAnyRole, setHidden');
                        element.addClass('hidden');
                    },
                    defineVisibility = function (reset) {
			console.log('hasAnyRole, defineVisibility');
                        var result;
                        if (reset) {
                            setVisible();
                        }

                        result = Principal.isInAnyRole(roles);
                        if (result) {
                            setVisible();
                        } else {
                            setHidden();
                        }
                    },
                    roles = attrs.hasAnyRole.replace(/\s+/g, '').split(',');

                if (roles.length > 0) {
                    defineVisibility(true);
                }
            }
        };
    }])
    .directive('hasRole', ['Principal', function (Principal) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var setVisible = function () {
                        console.log('hasRole, setVisible');
                        element.removeClass('hidden');
                    },
                    setHidden = function () {
                        console.log('hasRole, setHidden');
                        element.addClass('hidden');
                    },
                    defineVisibility = function (reset) {
                        console.log('hasRole, defineVisibility');
                        if (reset) {
                            setVisible();
                        }

                        Principal.isInRole(role)
                            .then(function(result) {
				console.log('Principal isInRole: result=' + result);
                                if (result) {
                                    setVisible();
                                } else {
                                    setHidden();
                                }
                            });
                    },
                    role = attrs.hasRole.replace(/\s+/g, '');
                    console.log('hasRole, defineVisibility, role=' + role);

		// TODO: to change
                //if (role.length > 0) {
                
                    defineVisibility(true);
                //}
            }
        };
    }]);
