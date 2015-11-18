;(function () {
    'use strict';

    angular.module('app.common')
        .controller('EditCorrectiveActionPlanController', ['$modalInstance', 'action', 'certificationResults', 'commonService', function ($modalInstance, action, certificationResults, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.cancel = cancel;
            vm.save = save;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.cap = {};
                vm.action = action;
                vm.certificationResults = certificationResults;
                vm.cap.certs = [];
                if (vm.action === 'initiate') {
                    for (var i = 0; i < vm.certificationResults.length; i++) {
                        if (vm.certificationResults[i].success) {
                            vm.cap.certs.push({
                                id: i,
                                number: vm.certificationResults[i].number,
                                title: vm.certificationResults[i].title,
                                error: false,
                                description: ''
                            });
                        }
                    }
                }
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function save () {
                  $modalInstance.close(vm.cap);
/*
  commonService.initiateCap(vm.certs)
                    .then(function (result) {
                        $modalInstance.close(result);
                    }), function (error) {
                        $modalInstance.dismss(error);
                    };
                    */
            }
        }]);
})();
