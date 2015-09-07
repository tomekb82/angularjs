var services = angular.module('services', []);
var directives = angular.module('directives', []);
var testme;
(function (testme) {
    testme.html = '<div>Hey wassup!</div>';
})(testme || (testme = {}));
var Controllers;
(function (Controllers) {
    var MainController = (function () {
        function MainController($scope, logService) {
            this.message = "asdasd";
            $scope.vm = this;
            logService.log("Message from MainController=" + $scope.vm.message);
        }
        return MainController;
    })();
    Controllers.MainController = MainController;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    var TestController = (function () {
        function TestController($scope) {
            this.message = "foo";
            $scope.vm = this;
        }
        return TestController;
    })();
    Controllers.TestController = TestController;
})(Controllers || (Controllers = {}));
directives.directive('testme', function () {
    return {
        restrict: 'EAC',
        template: testme.html
    };
});
var LogService = (function () {
    function LogService() {
    }
    LogService.prototype.log = function (msg) {
        console.log(msg);
    };
    return LogService;
})();
services.service('logService', LogService);
angular.module('controllers', []).controller(Controllers);
angular.module('myApp', ['controllers', 'services', 'directives']);
//# sourceMappingURL=out.js.map
