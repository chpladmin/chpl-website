(function () {
    'use strict';

    fdescribe('the Certification Criteria View component', function () {
        var $analytics, $compile, $log, $uibModal, Mock, actualOptions, ctrl, el, mock, scope;

        mock = {
            cert: {
                id: 1,
                criterion: {
                    number: 'initial cert',
                },
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.components');

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

                scope = $rootScope.$new();
                scope.cert = mock.cert;
                scope.refreshSed = jasmine.createSpy('refreshSed');
                scope.resources = {};
                scope.isConfirming = false;

                el = angular.element('<chpl-certification-criteria cert="cert" refresh-sed="refreshSed()" resources="resources" is-confirming="isConfirming"></chpl-certification-criteria>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('when asked about phantom data', function () {
                it('should not indicate any if the cert has success=true', function () {
                    ctrl.cert.success = true;
                    expect(ctrl.hasPhantomData()).toBe(false);
                });

                describe('and the cert has success=false', function () {
                    beforeEach(function () {
                        ctrl.cert = {success: false};
                    });

                    it('should analyze additionalSoftware', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.additionalSoftware = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.additionalSoftware = [1];
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze apiDocumentation', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.apiDocumentation = '';
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.apiDocumentation = 'something fake';
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze g1MacraMeasures', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g1MacraMeasures = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g1MacraMeasures = [1];
                        expect(ctrl.hasPhantomData()).toBe(false);
                    });

                    it('should analyze g1Success', function () {
                        ctrl.cert.g1Success = null;
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g1Success = false;
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g1Success = true;
                        expect(ctrl.hasPhantomData()).toBe(false);
                    });

                    it('should analyze g2MacraMeasures', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g2MacraMeasures = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g2MacraMeasures = [1];
                        expect(ctrl.hasPhantomData()).toBe(false);
                    });

                    it('should analyze g2Success', function () {
                        ctrl.cert.g2Success = null;
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g2Success = false;
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.g2Success = true;
                        expect(ctrl.hasPhantomData()).toBe(false);
                    });

                    it('should analyze gap', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.gap = false;
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.gap = true;
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze privacySecurityFramework', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.privacySecurityFramework = '';
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.privacySecurityFramework = 'something fake';
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze sed', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.sed = false;
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.sed = true;
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testDataUsed', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testDataUsed = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testDataUsed = [1];
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testFunctionality', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testFunctionality = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testFunctionality = [1];
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testProcedures', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testProcedures = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testProcedures = [1];
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testStandards', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testStandards = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testStandards = [1];
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });

                    it('should analyze testToolsUsed', function () {
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testToolsUsed = [];
                        expect(ctrl.hasPhantomData()).toBe(false);
                        ctrl.cert.testToolsUsed = [1];
                        expect(ctrl.hasPhantomData()).toBe(true);
                    });
                });
            });

            describe('when editing the certification', function () {
                var modalOptions;
                beforeEach(function () {
                    modalOptions = {
                        component: 'chplCertificationCriteriaEdit',
                        animation: false,
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            cert: jasmine.any(Function),
                            hasIcs: jasmine.any(Function),
                            isConfirming: jasmine.any(Function),
                            resources: jasmine.any(Function),
                        },
                    };
                });

                it('should create a modal instance', function () {
                    expect(ctrl.editUibModalInstance).toBeUndefined();
                    ctrl.editCert();
                    expect(ctrl.editUibModalInstance).toBeDefined();
                });

                it('should resolve elements', function () {
                    var hasIcs = true;
                    var resources = {}
                    ctrl.hasIcs = hasIcs;
                    ctrl.resources = resources;
                    ctrl.editCert();
                    expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                    expect(actualOptions.resolve.cert()).toEqual(ctrl.cert);
                    expect(actualOptions.resolve.hasIcs()).toEqual(hasIcs);
                    expect(actualOptions.resolve.resources()).toEqual(resources);
                });

                it('should restore the cert if cancelled', function () {
                    ctrl.editCert();
                    ctrl.cert = {id: 2, name: 'an edited cert'};
                    ctrl.editUibModalInstance.dismiss();
                    expect(ctrl.cert).toEqual(mock.cert);
                });

                it('should refresh SED after editing', () => {
                    const initCount = scope.refreshSed.calls.count();
                    ctrl.editCert();
                    ctrl.editUibModalInstance.close({id: 2, name: 'an edited cert'});
                    expect(scope.refreshSed.calls.count()).toBe(initCount + 1);
                });
            });

            describe('when toggling a criteria', function () {
                it('should flip from viewing to hiding', function () {
                    expect(ctrl.showDetails).toBeFalsy();
                    ctrl.toggleCriteria();
                    expect(ctrl.showDetails).toBe(true);
                    ctrl.toggleCriteria();
                    expect(ctrl.showDetails).toBe(false);
                });

                it('should track analytics when it opens', function () {
                    spyOn($analytics, 'eventTrack');
                    ctrl.toggleCriteria();
                    expect($analytics.eventTrack).toHaveBeenCalled();
                    expect($analytics.eventTrack.calls.count()).toBe(1);
                    ctrl.toggleCriteria();
                    expect($analytics.eventTrack.calls.count()).toBe(1);
                    ctrl.toggleCriteria();
                    expect($analytics.eventTrack.calls.count()).toBe(2);
                });
            });

            describe('when displaying the "view details" button', () => {
                it('should show when "success" is true', () => {
                    ctrl.cert.success = true;
                    expect(ctrl.showViewDetailsLink()).toBe(true);
                });

                describe('when "success" is false', () => {
                    beforeEach(() => {
                        ctrl.cert.success = false;
                        ctrl.cert.g1Success = null;
                        ctrl.cert.g2Success = null;
                        ctrl.cert.g1MacraMeasures = undefined;
                        ctrl.cert.g2MacraMeasures = undefined;
                    });

                    it('should show if there are g1 macra measures', () => {
                        expect(ctrl.showViewDetailsLink()).toBe(false);
                        ctrl.cert.g1MacraMeasures = [];
                        expect(ctrl.showViewDetailsLink()).toBe(false);
                        ctrl.cert.g1MacraMeasures = [1];
                        expect(ctrl.showViewDetailsLink()).toBe(true);
                    });

                    it('should show if there are g2 macra measures', () => {
                        expect(ctrl.showViewDetailsLink()).toBe(false);
                        ctrl.cert.g2MacraMeasures = [];
                        expect(ctrl.showViewDetailsLink()).toBe(false);
                        ctrl.cert.g2MacraMeasures = [2];
                        expect(ctrl.showViewDetailsLink()).toBe(true);
                    });

                    it('should show if g1Success is non-null', () => {
                        ctrl.cert.g1Success = false;
                        expect(ctrl.showViewDetailsLink()).toBe(true);
                        ctrl.cert.g1Success = true;
                        expect(ctrl.showViewDetailsLink()).toBe(true);
                    });

                    it('should show if g2Success is non-null', () => {
                        ctrl.cert.g2Success = false;
                        expect(ctrl.showViewDetailsLink()).toBe(true);
                        ctrl.cert.g2Success = true;
                        expect(ctrl.showViewDetailsLink()).toBe(true);
                    });
                });
            });
        });
    });
})();
