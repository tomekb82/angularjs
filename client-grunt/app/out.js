var Controllers;
(function (Controllers) {
    var MainController = (function () {
        function MainController($scope) {
            this.message = "asdasd";
            $scope.vm = this;
        }
        return MainController;
    })();
    Controllers.MainController = MainController;
})(Controllers || (Controllers = {}));
angular.module('controllers', []).controller(Controllers);
angular.module('myApp', ['controllers']);
//# sourceMappingURL=out.js.map
