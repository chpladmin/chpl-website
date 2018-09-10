(function () {
    'use strict';

    describe('the SED Collections controller', function () {

        var $log, $uibModal, Mock, actualOptions, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.collections', 'chpl', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _$uibModal_, _Mock_, _networkService_) {
                $log = _$log_;
                Mock = _Mock_;
                networkService = _networkService_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('SedCollectionController', {
                    $scope: scope,
                    networkService: networkService,
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

        describe('when making Details popup buttons', function () {
            it('should create a button', function () {
                var data = 34;
                expect(vm._makeDetailsButton(data)).toBe('<button class="btn btn-ai" ng-click="vm.callFunction({id:34})"><i class="fa fa-eye"></i> View</button>');
            });
        });

        describe('when opening details', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'chpl.collections/sed/sedModal.html',
                    controller: 'ViewSedModalController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        id: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewDetails(4);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.viewDetails(4);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.id()).toEqual(4);
            });
        });
    });
})();
