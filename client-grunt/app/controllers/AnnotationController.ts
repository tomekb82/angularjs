
module at_angular {

	@controller('myApp', 'AnnotationController')
	export class AnnotationController {
		message = "blablabla";
		constructor($scope, logService: LogService){
			$scope.vm = this;
			logService.log("Message from AnnotationController=" + $scope.vm.message);
		}
	};

}


