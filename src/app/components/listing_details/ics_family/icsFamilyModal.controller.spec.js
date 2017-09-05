(function () {
    'use strict';

    describe('the ICS Family Modal controller', function () {

        var $location, $log, Mock, mock, scope, vm;

        mock = {};
        mock.listing = {
            id: 3,
        };
        mock.icsFamily = [
            {
                id: 1,
                chplId: '15.07.07.1447.BE01.01.0.1.161014',
                certificationStatus: { name: 'Withdrawn by Developer' },
                parents: [],
                children: [
                    {id: 2, chplId: '15.07.07.1447.BE01.02.1.1.161014'},
                    {id: 3, chplId: '15.07.07.1447.BE01.03.2.1.161014'},
                ],
            },
            {
                id: 2,
                chplId: '15.07.07.1447.BE01.02.1.1.161014',
                certificationStatus: { name: 'Withdrawn by Developer' },
                parents: [
                    {id: 1, chplId: '15.07.07.1447.BE01.01.0.1.161014'},
                ],
                children: [
                    {id: 3, chplId: '15.07.07.1447.BE01.03.2.1.161014'},
                ],
            },
            {
                id: 3,
                chplId: '15.07.07.1447.BE01.03.2.1.161014',
                certificationStatus: { name: 'Active' },
                parents: [
                    {id: 1, chplId: '15.07.07.1447.BE01.01.0.1.161014'},
                    {id: 2, chplId: '15.07.07.1447.BE01.02.1.1.161014'},
                ],
                children: [
                    {id: 4, chplId: '15.07.07.1447.BE01.04.3.1.161014'},
                ],
            },
            {
                id: 4,
                chplId: '15.07.07.1447.BE01.04.3.1.161014',
                certificationStatus: { name: 'Active' },
                parents: [
                    {id: 3, chplId: '15.07.07.1447.BE01.03.2.1.161014'},
                ],
                children: [],
            },
        ];

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl');
            inject(function ($controller, _$location_, _$log_, $rootScope, _Mock_) {
                $location = _$location_;
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('IcsFamilyController', {
                    family: mock.icsFamily,
                    listing: mock.listing,
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have a way to close it\'s own modal', function () {
            expect(vm.close).toBeDefined();
            vm.close();
            expect(Mock.modalInstance.close).toHaveBeenCalledWith('closed');
        });

        it('should have cytoscape options', function () {
            expect(vm.icsOptions).toBeDefined();
            expect(vm.icsLayout).toBeDefined();
            expect(vm.icsCyGraphReady).toBeDefined();
            expect(vm.icsStyle).toBeDefined();
        });

        describe('when generating the graph', function () {
            it('should build nodes and edges', function () {
                expect(vm.icsElements).toBeDefined();
            });

            it('should have four nodes', function () {
                expect(vm.icsElements[1]).toBeDefined();
                expect(vm.icsElements[2]).toBeDefined();
                expect(vm.icsElements[3]).toBeDefined();
                expect(vm.icsElements[4]).toBeDefined();
            });

            it('should have four edges', function () {
                expect(vm.icsElements['1-2']).toBeDefined();
                expect(vm.icsElements['1-3']).toBeDefined();
                expect(vm.icsElements['2-3']).toBeDefined();
                expect(vm.icsElements['3-4']).toBeDefined();
            });

            it('should mark the nodes as nodes and set up data', function () {
                expect(vm.icsElements[1].group).toBe('nodes');
                expect(vm.icsElements[1].data).toEqual({
                    id: mock.icsFamily[0].id,
                    chplId: mock.icsFamily[0].chplId,
                    label: mock.icsFamily[0].chplId + '\n' + mock.icsFamily[0].certificationStatus.name,
                    details: mock.icsFamily[0],
                });
            });

            it('should mark the edges as nodes and set up data', function () {
                expect(vm.icsElements['1-2'].group).toBe('edges');
                expect(vm.icsElements['1-2'].data).toEqual({
                    id: '1-2',
                    source: 1,
                    target: 2,
                });
            });

            it('should mark the active node as active', function () {
                expect(vm.icsElements[1].data.active).toBeUndefined();
                expect(vm.icsElements[3].data.active).toBe(true);
            });
        });

        describe('when comparing the family', function () {
            it('should navigate to the compare page', function () {
                spyOn($location, 'path');
                vm.compare();
                expect($location.path).toHaveBeenCalledWith('/compare/1&2&3&4');
            });

            it('should close the modal', function () {
                vm.compare();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('compared');
            });
        });
    });
})();
