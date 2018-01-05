(function () {
    'use strict';

    angular
        .module('chpl.product')
        .controller('ProductHistoryController', ProductHistoryController);

    /** @ngInject */
    function ProductHistoryController ($filter, $location, $log, $uibModalInstance, activity) {
        var vm = this;

        vm.cancel = cancel;
        vm.goToApi = goToApi;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.activity = activity;
            interpretActivity();
            vm.activity = vm.activity.filter(function (a) { return a.change && a.change.length > 0; });
        }

        function cancel () {
            $uibModalInstance.dismiss('product history cancelled');
        }

        function goToApi () {
            $location.path('/resources/chpl_api');
            vm.cancel();
        }

        ////////////////////////////////////////////////////////////////////

        function interpretActivity () {
            var activity, curr, prev;
            for (var i = 0; i < vm.activity.length; i++) {
                activity = vm.activity[i];
                activity.change = [];
                prev = activity.originalData;
                curr = activity.newData;
                if (prev && curr) {
                    vm.listingId = prev.id;
                    if (activity.description.startsWith('Updated certified product')) {
                        var changeCC = false;
                        var criteria = [];
                        var pCC = prev.certificationResults;
                        var cCC = curr.certificationResults;

                        pCC.sort(function (a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                        cCC.sort(function (a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                        for (var j = 0; j < pCC.length; j++) {
                            if (!pCC[j].success && cCC[j].success) {
                                changeCC = true;
                                criteria.push('<li>' + pCC[j].number + '</li>');
                            }
                        }
                        if (changeCC) {
                            activity.change.push('Added certification criteria:<ul>' + criteria.join('') + '</ul>');
                        }
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
                    vm.listingId = curr.id;
                    activity.change.push('Certified product was uploaded to the CHPL');
                }
            }

            var ce = (vm.activity[vm.activity.length - 1]).newData.certificationEvents;
            vm.activity = vm.activity.concat(ce.map(function (e) {
                e.activityDate = e.eventDate;
                if (e.certificationStatusName) {
                    e.change = ['Certification Status became "' + e.certificationStatusName + '"'];
                } else {
                    e.change = ['Certification Status became "' + e.status.name + '"'];
                }
                return e;
            }));
        }
    }
})();
