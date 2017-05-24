(function () {
    'use strict';

    angular
        .module('chpl.product')
        .controller('ProductHistoryController', ProductHistoryController);

    /** @ngInject */
    function ProductHistoryController ($log, $uibModalInstance, activity) {
        var vm = this;

        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.activity = activity;
            interpretActivity();
        }

        function cancel () {
            $uibModalInstance.dismiss('product history cancelled');
        }

        ////////////////////////////////////////////////////////////////////

        function interpretActivity () {
            var activity, prev, curr;
            for (var i = 0; i < vm.activity.length; i++) {
                activity = vm.activity[i];
                activity.change = [];
                prev = activity.originalData;
                curr = activity.newData;
                if (prev && curr) {
                    if (prev.certificationStatus.name !== curr.certificationStatus.name) {
                        activity.change.push('Certification Status changed from "' + prev.certificationStatus.name + '" to "' + curr.certificationStatus.name + '"');
                    }
                }

                if (activity.description.startsWith('Surveillance was added')) {
                    activity.change.push('Surveillance activity was added');
                }

                if (activity.description.startsWith('Surveillance was updated')) {
                    activity.change.push('Surveillance activity was updated');
                }

                if (activity.description.startsWith('Surveillance was delete')) {
                    activity.change.push('Surveillance activity was deleted');
                }

                if (activity.description === 'Created a certified product') {
                    activity.change.push('Certified product was uploaded to the CHPL');
                }
            }
        }
    }
})();
