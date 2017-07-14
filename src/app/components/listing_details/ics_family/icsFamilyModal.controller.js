(function () {
    'use strict';

    angular.module('chpl')
        .controller('IcsFamilyController', IcsFamilyController);

    /** @ngInject */
    function IcsFamilyController ($location, $log, $scope, $uibModalInstance, cytoData, family, listing) {
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
            $location.path('/compare/' + vm.icsFamily
                           .map(function (item) { return item.id; })
                           .join('&'));
            $uibModalInstance.close('compared');
        }

        ////////////////////////////////////////////////////////////////////

        function prepareIcsGraph () {
            vm.icsOptions = {
                //autoungrabify: true,
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
                        'background-color': 'red',
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
            });
            /*
            cytoData.getGraph('ics-cytoscape').then(function (graph) {
                angular.forEach(vm.icsElements, function (ele) {
                    if (ele.data.chplId) {
                      ele.data.label = ele.data.chplId;
                    }
                });
                vm.graphPng = graph.png();
                vm.icsImageGenerated = true;
            });
            */

            var edge, i, j, node;
            for (i = 0; i < vm.icsFamily.length; i++) {
                node = {
                    group: 'nodes',
                    data: {
                        id: vm.icsFamily[i].id,
                        chplId: vm.icsFamily[i].chplId,
                        label: vm.icsFamily[i].chplId,
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
