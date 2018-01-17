(function () {
    'use strict';

    describe('the Fuzzy Matching Management', function () {
        var $compile, $log, $q, $uibModal, Mock, actualOptions, el, mock, networkService, scope, vm;

        mock = {
            fuzzyTypes: [
                {id: 1, fuzzyType: 'a type', choices: [1,2]},
                {id: 2, fuzzyType: 'another type', choices: [1,2,3]},
            ],
        };

        beforeEach(function () {
            module('chpl.templates', 'chpl.admin', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getFuzzyTypes = jasmine.createSpy('getFuzzyTypes');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _networkService_) {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                networkService = _networkService_;
                networkService.getFuzzyTypes.and.returnValue($q.when(mock.fuzzyTypes));

                el = angular.element('<ai-fuzzy-management></ai-fuzzy-management>');

                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                scope.vm = vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
            });

            it('should call the service to load fuzzy types on load', function () {
                expect(networkService.getFuzzyTypes).toHaveBeenCalled();
            });

            it('should load types on load', function () {
                expect(vm.fuzzyTypes.length).toBe(2);
            });

            describe('when editing a fuzzy type', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'app/admin/components/fuzzy/edit.html',
                        controller: 'FuzzyEditController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            fuzzyType: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.modalInstance).toBeUndefined();
                    vm.edit(vm.fuzzyTypes[0]);
                    expect(vm.modalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    vm.edit(vm.fuzzyTypes[0]);
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.fuzzyType()).toEqual(mock.fuzzyTypes[0]);
                });

                it('should refresh from the network when closed', function () {
                    var initCallCount = networkService.getFuzzyTypes.calls.count();
                    vm.edit(vm.fuzzyTypes[0]);
                    vm.modalInstance.close();
                    expect(networkService.getFuzzyTypes.calls.count()).toBe(initCallCount + 1);
                });
            });
        });
    });
})();
