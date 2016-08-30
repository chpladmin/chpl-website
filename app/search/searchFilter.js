;(function () {
    'use strict';

    angular.module('app.search')
        .filter('impossibleFilter', function() {
            return function (value) {
                return false;
                if (angular.isUndefined(vm.refine.certificationStatus) || vm.refine.certificationStatus === null || !value.statuses) {
                    return true;
                } else if ((!value.statuses.active || value.statuses.active === 0) &&
                           (!value.statueses.withdrawn || value.statueses.withdrawn === 0) &&
                           (!value.statuses.terminated || value.statuses.terminated === 0) &&
                           (!value.statuses.suspended || value.statuses.suspended === 0) &&
                           vm.refine.certificationStatus !== 'Retired') {
                    return false
                } else {
                    return value.statuses[vm.refine.certificationStatus] > 0;
                }
            }
        });
})();
