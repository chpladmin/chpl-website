(function () {
    'use strict';

    describe('chpl.admin.SplitDeveloperController.controller', function () {
        var $compile, $log, $q, Mock, ctrl, el, networkService, scope;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.splitDeveloper = jasmine.createSpy('splitDeveloper');
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.splitDeveloper.and.returnValue($q.when({
                    oldDeveloper: 'a developer',
                    newDeveloper: 'new developer',
                }));
                networkService.getAcbs.and.returnValue($q.when({ acbs: Mock.acbs }));

                el = angular.element('<ai-developer-split close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-developer-split>');

                scope = $rootScope.$new();
                scope.close = jasmine.createSpy('close');
                scope.dismiss = jasmine.createSpy('dismiss');
                scope.resolve = {
                    developer: Mock.developers[0],
                    products: Mock.products,
                }
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
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

            it('should have a way to close it\'s own modal', () => {
                expect(ctrl.cancel).toBeDefined();
                ctrl.cancel();
                expect(scope.dismiss).toHaveBeenCalled();
            });

        });

        describe('when moving product(s) to a new developer', () => {
            it('should remove the product(s) from the old list', () => {
                ctrl.productsToMoveToNew = [1,2];
                ctrl.splitDeveloper.newProducts = [];
                ctrl.splitDeveloper.oldProducts = [1,2,3,4];
                ctrl.moveToNew();
                expect(ctrl.splitDeveloper.oldProducts.length).toEqual(2);
            });

            it('should add the product to the new list', () => {
                ctrl.productsToMoveToNew = [1,2];
                ctrl.splitDeveloper.newProducts = [];
                ctrl.splitDeveloper.oldProducts = [1,2,3,4];
                ctrl.moveToNew();
                expect(ctrl.splitDeveloper.newProducts.length).toEqual(2);
            });

            it('should clear the list of products to be moved', () => {
                ctrl.productsToMoveToNew = [1,2];
                ctrl.splitDeveloper.newProducts = [];
                ctrl.splitDeveloper.oldProducts = [1,2,3,4];
                ctrl.moveToNew();
                expect(ctrl.productsToMoveToNew.length).toEqual(0);
            });
        });

        describe('when moving product(s) to the original developer', () => {
            it('should remove the product(s) from the new list', () => {
                ctrl.productsToMoveToOld = [1,2];
                ctrl.splitDeveloper.newProducts = [1,2,3,4];
                ctrl.splitDeveloper.oldProducts = [];
                ctrl.moveToOld();
                expect(ctrl.splitDeveloper.newProducts.length).toEqual(2);
            });

            it('should add the product to the old list', () => {
                ctrl.productsToMoveToOld = [1,2];
                ctrl.splitDeveloper.newProducts = [1,2,3,4];
                ctrl.splitDeveloper.oldProducts = [];
                ctrl.moveToOld();
                expect(ctrl.splitDeveloper.oldProducts.length).toEqual(2);
            });

            it('should clear the list of products to be moved', () => {
                ctrl.productsToMoveToOld = [1,2];
                ctrl.splitDeveloper.newProducts = [1,2,3,4];
                ctrl.splitDeveloper.oldProducts = [];
                ctrl.moveToOld();
                expect(ctrl.productsToMoveToOld.length).toEqual(0);
            });
        });

        describe('when an transparency attestation changes', () => {
            it('should add the transparency attestation to the new developer', () => {
                ctrl.attestations = {1: 'Negative'};
                ctrl.splitDeveloper.newDeveloper.transparencyAttestations = [];
                ctrl.attestationChange();
                expect(ctrl.splitDeveloper.newDeveloper.transparencyAttestations.length).toEqual(1);
            });
        });

        describe('when a developer split is saved', () => {
            it('should close it\'s own modal on a status:200 response', () => {
                networkService.splitDeveloper.and.returnValue($q.when({status: 200}));
                ctrl.splitDeveloper = {
                    newDeveloper: {},
                    oldDeveloper: {},
                    newProducts: [],
                    oldProducts: [],
                };
                ctrl.save();
                scope.$digest();
                expect(scope.close).toHaveBeenCalled();
            });

            it('should report errors if response has errors', () => {
                networkService.splitDeveloper.and.returnValue($q.when({status: 401, data: {errorMessages: ['This is an error', 'This is another error']}}));
                ctrl.splitDeveloper = {
                    newDeveloper: {},
                    oldDeveloper: {},
                    newProducts: [],
                    oldProducts: [],
                };
                ctrl.errorMessages = [];
                ctrl.save();
                scope.$digest();
                expect(ctrl.errorMessages.length).toBe(2);
            });

            it('should not close it\'s own modal when response has errors', () => {
                networkService.splitDeveloper.and.returnValue($q.when({status: 401, data: {errorMessages: ['This is an error', 'This is another error']}}));
                ctrl.splitDeveloper = {
                    newDeveloper: {},
                    oldDeveloper: {},
                    newProducts: [],
                    oldProducts: [],
                };
                ctrl.errorMessages = [];
                ctrl.save();
                scope.$digest();
                expect(scope.close).not.toHaveBeenCalled();
            });

            it('should pass the the split developer data to the network service', () => {
                networkService.splitDeveloper.and.returnValue($q.when({status: 200}));
                ctrl.splitDeveloper = {
                    newDeveloper: {},
                    oldDeveloper: {},
                    newProducts: [],
                    oldProducts: [],
                };
                ctrl.save();
                scope.$digest();
                expect(networkService.splitDeveloper).toHaveBeenCalledWith(ctrl.splitDeveloper);
            });

        });
    });
})();
