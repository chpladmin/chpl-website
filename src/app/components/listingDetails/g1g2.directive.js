(function () {
    'use strict';

    angular
        .module('chpl')
        .directive('aiG1g2', aiG1g2)
        .controller('G1G2DetailsController', G1G2DetailsController);

    /** @ngInject */
    function aiG1g2 () {
        var directive = {
            bindToController: {
                listing: '=',
            },
            controller: 'G1G2DetailsController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/components/listingDetails/g1g2.html',
        };
        return directive;
    }

    /** @ngInject */
    function G1G2DetailsController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {/*
            $scope.$watch('vm.listing', function (listing) {
                if (listing) {
                    // do stuff
                    }}, true);*/
            analyzeMeasures();
        }

        ////////////////////////////////////////////////////////////////////

        function analyzeMeasures () {
            var appending, cert, doubleG, i, j, k;
            vm.measures = [];
            for (i = 0; i < vm.listing.certificationResults.length; i++) {
                cert = vm.listing.certificationResults[i];
                if (cert.success && (cert.g1MacraMeasures || cert.g2MacraMeasures)) {
                    for (j = 0; j < cert.g1MacraMeasures.length; j++) {
                        appending = true;
                        for (k = 0; k < vm.measures.length; k++) {
                            if (vm.measures[k].name === cert.g1MacraMeasures[j].name &&
                                vm.measures[k].description === cert.g1MacraMeasures[j].description &&
                                vm.measures[k].g === 'G1') {
                                vm.measures[k].criteria.push(cert.g1MacraMeasures[j].criteria.number);
                                appending = false;
                            }
                        }
                        if (appending) {
                            vm.measures.push({
                                name: cert.g1MacraMeasures[j].name,
                                description: cert.g1MacraMeasures[j].description,
                                g: 'G1',
                                criteria: [cert.g1MacraMeasures[j].criteria.number],
                            });
                        }
                    }
                    for (j = 0; j < cert.g2MacraMeasures.length; j++) {
                        appending = true;
                        for (k = 0; k < vm.measures.length; k++) {
                            if (vm.measures[k].name === cert.g2MacraMeasures[j].name &&
                                vm.measures[k].description === cert.g2MacraMeasures[j].description &&
                                vm.measures[k].g === 'G2') {
                                vm.measures[k].criteria.push(cert.g2MacraMeasures[j].criteria.number);
                                appending = false;
                            }
                        }
                        if (appending) {
                            vm.measures.push({
                                name: cert.g2MacraMeasures[j].name,
                                description: cert.g2MacraMeasures[j].description,
                                g: 'G2',
                                criteria: [cert.g2MacraMeasures[j].criteria.number],
                            });
                        }
                    }
                }
            }
            for (i = 0; i < vm.measures.length - 1; i++) {
                for (j = i + 1; j < vm.measures.length; j++) {
                    doubleG = false;
                    if (vm.measures[i].name === vm.measures[j].name &&
                        vm.measures[i].description === vm.measures[j].description &&
                        vm.measures[i].criteria.length === vm.measures[j].criteria.length) {
                        for (k = 0; k < vm.measures[i].criteria.length; k++) {
                            doubleG = doubleG || vm.measures[j].criteria.indexOf(vm.measures[i].criteria[k]) > -1;
                        }
                    }
                    if (doubleG) {
                        vm.measures[i].g = 'G1;G2';
                        vm.measures.splice(k,1);
                    }
                }
            }
        }
    }
})();
