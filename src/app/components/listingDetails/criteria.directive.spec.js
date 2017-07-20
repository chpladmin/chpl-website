(function () {
    'use strict';

    describe('the Certification Criteria', function () {
        var $analytics, $compile, $log, $uibModal, Mock, actualOptions, el, mock, scope, vm;

        mock = {};
        mock.cert = {};

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl');

            inject(function (_$analytics_, _$compile_, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $analytics = _$analytics_;
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                el = angular.element('<ai-certification-criteria cert="cert"></ai-certification-criteria>');
                scope = $rootScope.$new();
                scope.cert = mock.cert;
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
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

            describe('when editing the certification', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        templateUrl: 'app/components/listingDetails/criteriaModal.html',
                        controller: 'EditCertificationCriteriaController',
                        controllerAs: 'vm',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            cert: jasmine.any(Function),
                            hasIcs: jasmine.any(Function),
                            resources: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(vm.editUibModalInstance).toBeUndefined();
                    vm.editCert();
                    expect(vm.editUibModalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    var hasIcs = true;
                    var resources = {}
                    vm.hasIcs = hasIcs;
                    vm.resources = resources;
                    vm.editCert();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.cert()).toEqual(vm.cert);
                    expect(actualOptions.resolve.hasIcs()).toEqual(hasIcs);
                    expect(actualOptions.resolve.resources()).toEqual(resources);
                });

                it('should replace the cert with the response', function () {
                    vm.editCert();
                    vm.editUibModalInstance.close({name: 'new'});
                    expect(vm.cert).toEqual({name: 'new'});
                });

                it('should log a non-cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.editCert();
                    vm.editUibModalInstance.dismiss('not cancelled');
                    expect($log.info.logs.length).toBe(logCount + 1);
                });

                it('should not log a cancelled modal', function () {
                    var logCount = $log.info.logs.length;
                    vm.editCert();
                    vm.editUibModalInstance.dismiss('cancelled');
                    expect($log.info.logs.length).toBe(logCount);
                });
            });

            describe('when saving the cert edits', function () {
                it('should remove N/A keys', function () {
                    vm.cert.gap = 'null';
                    vm.cert.g1Success = 'null';
                    vm.cert.g2Success = 'null';
                    vm.cert.sed = 'null';
                    vm.saveEdits();
                    expect(vm.cert.gap).toBeUndefined();
                    expect(vm.cert.g1Success).toBeUndefined();
                    expect(vm.cert.g2Success).toBeUndefined();
                    expect(vm.cert.sed).toBeUndefined();
                });

                it('shouldn\'t remove valid keys', function () {
                    vm.cert.gap = 'a thing';
                    vm.cert.g1Success = 'a thing';
                    vm.cert.g2Success = 'a thing';
                    vm.cert.sed = 'a thing';
                    vm.saveEdits();
                    expect(vm.cert.gap).toBe('a thing');
                    expect(vm.cert.g1Success).toBe('a thing');
                    expect(vm.cert.g2Success).toBe('a thing');
                    expect(vm.cert.sed).toBe('a thing');
                });
            });

            describe('when toggling a criteria', function () {
                it('should flip from viewing to hiding', function () {
                    expect(vm.showDetails).toBeFalsy();
                    vm.toggleCriteria();
                    expect(vm.showDetails).toBe(true);
                    vm.toggleCriteria();
                    expect(vm.showDetails).toBe(false);
                });

                it('should track analytics when it opens', function () {
                    spyOn($analytics, 'eventTrack');
                    vm.toggleCriteria();
                    expect($analytics.eventTrack).toHaveBeenCalled();
                    expect($analytics.eventTrack.calls.count()).toBe(1);
                    vm.toggleCriteria();
                    expect($analytics.eventTrack.calls.count()).toBe(1);
                    vm.toggleCriteria();
                    expect($analytics.eventTrack.calls.count()).toBe(2);
                });
            });
        });
    });
})();
