
module annotations {

	@controller('controllers', 'AnnotationController')
	export class AnnotationController {
		message = "aaaaaa";
		constructor($scope, logService: LogService){
			$scope.vm = this;
			logService.log("Message from AnnotationController=" + $scope.vm.message);
		}
	};

}


