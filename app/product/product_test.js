;(function () {
    'use strict';

    describe('app.product.controller', function () {

        var commonService, scope, ctrl, $log;

        var fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                    return this;
                },
                catch: function (cancelCallback) {
                    this.cancelCallback = cancelCallback;
                    return this;
                },
                finally: function (finallyCallback) {
                    this.finallyCallback = finallyCallback;
                    return this;
                }
            },
            close: function (item) {
                this.result.confirmCallBack(item);
            },
            dismiss: function (item) {
                this.result.cancelCallback(item);
            },
            finally: function () {
                this.result.finallyCallback();
            }
        };

        beforeEach(function () {
            var mockCommonService = {};
            module('app.product', function($provide) {
                $provide.value('commonService', mockCommonService);
            });

            inject(function($q) {
                mockCommonService.products = [
                    { developer: 'Developer', product: 'Product' }
                ];

                mockCommonService.getProduct = function (pid) {
                    var defer = $q.defer();
                    defer.resolve(this.products[0]);
                    return defer.promise;
                };

                mockCommonService.getCap = function (pid) {
                    return $q.when({plans: []});
                };

                mockCommonService.getSurveillance = function (pid) {
                    return $q.when({surveillance: []});
                };
            });

            inject(function($modal) {
                spyOn($modal, 'open').and.returnValue(fakeModal);
            });
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_, _$modal_) {
            $log = _$log_;
            scope = $rootScope.$new();
            commonService = _commonService_;
            ctrl = $controller('ProductController', {
                $scope: scope,
                $routeParams: {id: '123234'},
                commonService: commonService,
                $modal: _$modal_
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(ctrl).toBeDefined();
        });

        it('should have items in the modal', function () {
            ctrl.product.lastModifiedItems = ["test", "test"];
            expect(ctrl.modalInstance).not.toBeDefined();
            ctrl.openLastModified();
            expect(ctrl.modalInstance).toBeDefined();
        });
    });
})();
