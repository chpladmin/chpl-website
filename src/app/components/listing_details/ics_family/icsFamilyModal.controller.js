(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('IcsFamilyController', IcsFamilyController);

    /** @ngInject */
    function IcsFamilyController ($location, $log, $scope, $uibModal, $uibModalInstance, cytoData, family, listing) {
        var vm = this;

        vm.close = close;
        vm.compare = compare;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.listing = listing;
            vm.icsFamily = family;
            prepareIcsGraph();
        }

        function close () {
            $uibModalInstance.close('closed');
        }

        function compare () {
            $location.path('/compare/' + vm.icsFamily.map(function (item) { return item.id; }).join('&'));
            $uibModalInstance.close('compared');
        }

        ////////////////////////////////////////////////////////////////////

        function prepareIcsGraph () {
            vm.icsOptions = {
                autoungrabify: true,
                //userPanningEnabled: true,
                //userZoomingEnabled: true,
                minZoom: .3,
                maxZoom: 3,
            };

            vm.icsLayout = {
                name: 'breadthfirst',
                animate: true,
                directed: 'true',
                spacingFactor: 1.1,
            };

            vm.icsCyGraphReady = function (evt) {
                $log.info('graph ready to be interacted with: ', evt);
            }

            vm.icsStyle = [
                {
                    selector: 'node',
                    style: {
                        width: 'label' ,
                        height: 'label',
                        shape: 'roundrectangle',
                        label: 'data(label)',
                        color: 'white',
                        'font-size': '12pt',
                        'min-zoomed-font-size': '6pt',
                        'text-halign': 'center',
                        'text-valign': 'center',
                        'text-wrap': 'wrap',
                        'text-max-width': 1000,
                        'border-width': 0,
                        'background-color': 'blue',
                        'padding-left': '10px',
                        'padding-top': '15px',
                        'padding-right': '10px',
                        'padding-bottom': '15px',
                    },
                },
                {
                    selector: 'node[?active]',
                    style: {
                        'background-color': 'green',
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 6,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                    },
                },
            ];
            vm.icsElements = {};

            $scope.$on('cy:node:click', function (ng, cy) {
                var node = cy.cyTarget;
                $log.info('click', cy, node.data());
                vm.uibModalInstance = $uibModal.open({
                    templateUrl: 'chpl.components/listing_details/ics_family/icsFamilyDetail.html',
                    controller: 'IcsFamilyDetailController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'sm',
                    resolve: {
                        active: function () { return node.data().active; },
                        listing: function () { return node.data().details; },
                    },
                });
                vm.uibModalInstance.result.then(function (result) {
                    if (result === 'navigated') {
                        $uibModalInstance.close('navigated');
                    }
                });
            });

            var edge, i, j, node;
            for (i = 0; i < vm.icsFamily.length; i++) {
                node = {
                    group: 'nodes',
                    data: {
                        id: vm.icsFamily[i].id,
                        chplProductNumber: vm.icsFamily[i].chplProductNumber,
                        label: vm.icsFamily[i].chplProductNumber + '\n' + vm.icsFamily[i].certificationStatus.name,
                        details: vm.icsFamily[i],
                    },
                };
                if (node.data.id === vm.listing.id) {
                    node.data.active = true;
                }
                vm.icsElements[node.data.id] = node;
                for (j = 0; j < vm.icsFamily[i].parents.length; j++) {
                    edge = {
                        group: 'edges',
                        data: {
                            source: vm.icsFamily[i].parents[j].id,
                            target: node.data.id,
                            id: vm.icsFamily[i].parents[j].id + '-' + node.data.id,
                        },
                    };
                    vm.icsElements[edge.data.id] = edge;
                }
            }
        }
    }
})();
