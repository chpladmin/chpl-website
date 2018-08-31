(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('JobController', JobController);

    /** @ngInject */
    function JobController ($log, $uibModalInstance, SPLIT_PRIMARY, job, networkService) {
        var vm = this;

        vm.addNewItem = addNewItem;
        vm.cancel = cancel;
        vm.removeItem = removeItem;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.job = angular.copy(job);
            vm.newItem = {};
            vm.SPLIT_PRIMARY = SPLIT_PRIMARY;
        }

        function addNewItem (item) {
            const key = item.split('-')[0];
            const vals = vm.job.jobDataMap[key].split(vm.SPLIT_PRIMARY);
            vals.push(vm.newItem[item]);
            vm.newItem[item] = '';
            vm.job.jobDataMap[key] = vals.join(vm.SPLIT_PRIMARY);
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function removeItem (item, value) {
            const key = item.split('-')[0];
            const vals = vm.job.jobDataMap[key].split(vm.SPLIT_PRIMARY).filter(function (v) { return v !== value; });
            vm.job.jobDataMap[key] = vals.join(vm.SPLIT_PRIMARY);
        }

        function save () {
            networkService.updateJob(vm.job)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close({
                            job: response,
                            status: 'updated',
                        });
                    } else {
                        vm.errorMessage = response.data.error;
                    }
                },function (error) {
                    vm.errorMessage = error.data.error;
                });
        }
    }
})();
