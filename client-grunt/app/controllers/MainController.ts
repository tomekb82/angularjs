module Controllers {
	export class MainController {
		message = "asdasd";
		constructor($scope, logService: LogService){
			$scope.vm = this;
			logService.log("Message from MainController=" + $scope.vm.message);
		}
	}

}
