(() => {
    'use strict';

    describe('the surveillance nonconformity edit component', () => {
        var $compile, $log, $q, authService, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.admin', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.deleteSurveillanceDocument = jasmine.createSpy('deleteSurveillanceDocument');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.getApiKey.and.returnValue('api key');
                authService.getToken.and.returnValue('token');
                networkService = _networkService_;
                networkService.deleteSurveillanceDocument.and.returnValue($q.when({}));

                el = angular.element('<ai-surveillance-nonconformity-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');

                scope = $rootScope.$new();
                scope.close = jasmine.createSpy('close');
                scope.dismiss = jasmine.createSpy('dismiss');
                scope.resolve = {
                    disableValidation: false,
                    nonconformity: {},
                    randomized: false,
                    randomizedSitesUsed: undefined,
                    requirementId: 1,
                    surveillanceId: 1,
                    surveillanceTypes: {},
                    workType: 'create',
                };
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.debug('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            it('should be able close it\'s own modal', () => {
                expect(ctrl.cancel).toBeDefined();
                ctrl.cancel();
                expect(scope.dismiss).toHaveBeenCalled();
            });

            it('should convert dateTime longs to javascript objects on load', () => {
                var aDate = new Date('1/1/2003');
                var nc = {
                    dateOfDetermination: aDate.getTime(),
                    capApprovalDate: aDate.getTime(),
                    capStartDate: aDate.getTime(),
                    capEndDate: aDate.getTime(),
                    capMustCompleteDate: aDate.getTime(),
                };
                scope.resolve = {
                    disableValidation: false,
                    nonconformity: nc,
                    randomized: false,
                    randomizedSitesUsed: undefined,
                    requirementId: 1,
                    surveillanceId: 1,
                    surveillanceTypes: {},
                    workType: 'create',
                };
                el = angular.element('<ai-surveillance-nonconformity-edit close="close()" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(ctrl.nonconformity.dateOfDeterminationObject).toEqual(aDate);
                expect(ctrl.nonconformity.capApprovalDateObject).toEqual(aDate);
                expect(ctrl.nonconformity.capStartDateObject).toEqual(aDate);
                expect(ctrl.nonconformity.capEndDateObject).toEqual(aDate);
                expect(ctrl.nonconformity.capMustCompleteDateObject).toEqual(aDate);
            });

            it('should convert ncT status to objects on load', () => {
                var data = {
                    nonconformityStatusTypes: {data: [{id: 1, name: 'Open'},{id: 2, name: 'name2'}]},
                };
                scope.resolve = {
                    disableValidation: false,
                    nonconformity: {status: {name: 'Open'}},
                    randomized: false,
                    randomizedSitesUsed: undefined,
                    requirementId: 1,
                    surveillanceId: 1,
                    surveillanceTypes: data,
                    workType: 'create',
                };
                el = angular.element('<ai-surveillance-nonconformity-edit close="close()" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
                expect(ctrl.nonconformity.status.id).toBe(data.nonconformityStatusTypes.data[0].id);
            });

            describe('when editing the FileUploader', () => {
                beforeEach(() => {
                    scope.resolve = {
                        disableValidation: false,
                        nonconformity: {},
                        randomized: false,
                        randomizedSitesUsed: undefined,
                        requirementId: 1,
                        surveillanceId: 1,
                        surveillanceTypes: {},
                        workType: 'edit',
                    };
                    el = angular.element('<ai-surveillance-nonconformity-edit close="close()" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should exist', () => {
                    expect(ctrl.uploader).toBeDefined();
                });

                it('should log results', () => {
                    var logCount = $log.info.logs.length;
                    ctrl.uploader.onCompleteItem();
                    expect($log.info.logs.length).toBe(logCount + 1);
                    ctrl.uploader.onErrorItem();
                    expect($log.info.logs.length).toBe(logCount + 2);
                    ctrl.uploader.onCancelItem();
                    expect($log.info.logs.length).toBe(logCount + 3);
                });

                it('should mark the uploaded document as pending', () => {
                    ctrl.nonconformity.documents = [];
                    ctrl.uploader.onSuccessItem({file: {name: 'a name'}});
                    expect(ctrl.nonconformity.documents[0]).toEqual({fileName: 'a name is pending'});
                });
            });

            describe('when deleting a document', () => {
                beforeEach(() => {
                    ctrl.surveillanceId = 1;
                    ctrl.nonconformity = {id: 2};
                    ctrl.nonconformity.documents = [
                        {id: 1},
                        {id: 2},
                        {id: 3},
                    ];
                });

                it('should call the common service', () => {
                    ctrl.deleteDoc(3);
                    scope.$digest();
                    expect(networkService.deleteSurveillanceDocument).toHaveBeenCalledWith(1, 3);
                });

                it('should remove the deleted document from the list', () => {
                    ctrl.deleteDoc(3);
                    scope.$digest();
                    expect(ctrl.nonconformity.documents.length).toBe(2);
                });
            });

            describe('when saving the nonconformity', () => {
                it('should convert date objects to longs', () => {
                    var aDate = new Date('1/1/2003');
                    ctrl.nonconformity = {
                        dateOfDeterminationObject: aDate,
                        capApprovalDateObject: aDate,
                        capStartDateObject: aDate,
                        capEndDateObject: aDate,
                        capMustCompleteDateObject: aDate,
                    };
                    expect(ctrl.nonconformity.dateOfDetermination).toBeUndefined();
                    expect(ctrl.nonconformity.capApprovalDate).toBeUndefined();
                    expect(ctrl.nonconformity.capStartDate).toBeUndefined();
                    expect(ctrl.nonconformity.capEndDate).toBeUndefined();
                    expect(ctrl.nonconformity.capMustCompleteDate).toBeUndefined();
                    ctrl.save();
                    expect(ctrl.nonconformity.dateOfDetermination).toBe(aDate.getTime());
                    expect(ctrl.nonconformity.capApprovalDate).toBe(aDate.getTime());
                    expect(ctrl.nonconformity.capStartDate).toBe(aDate.getTime());
                    expect(ctrl.nonconformity.capEndDate).toBe(aDate.getTime());
                    expect(ctrl.nonconformity.capMustCompleteDate).toBe(aDate.getTime());
                });

                it('should remove date values if no object exists', () => {
                    ctrl.nonconformity = {
                        dateOfDetermination: 'fake',
                        capApprovalDate: 'fake',
                        capStartDate: 'fake',
                        capEndDate: 'fake',
                        capMustCompleteDate: 'fake',
                    };
                    ctrl.save();
                    expect(ctrl.nonconformity.dateOfDetermination).toBe(null);
                    expect(ctrl.nonconformity.capApprovalDate).toBe(null);
                    expect(ctrl.nonconformity.capStartDate).toBe(null);
                    expect(ctrl.nonconformity.capEndDate).toBe(null);
                    expect(ctrl.nonconformity.capMustCompleteDate).toBe(null);
                });

                it('should close it\'s modal with the NC', () => {
                    ctrl.nonconformity = {id: 'an NC'};
                    ctrl.save();
                    expect(scope.close).toHaveBeenCalled();
                });
            });
        });
    });
})();
