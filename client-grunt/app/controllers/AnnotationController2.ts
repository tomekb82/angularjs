
module at_angular {

	@controller('controllers', 'AnnotationController2')
	export class AnnotationController2 {
		message = "fffffffffffff";
		constructor($scope, logService: LogService){
			$scope.vm = this;
			logService.log("Message from AnnotationController=" + $scope.vm.message);
		}
	};

}


