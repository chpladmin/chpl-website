(function () {
    'use strict';

    describe('the CMS Widget Display directive', function () {
        var $compile, $log, el, mock, scope;
        mock = {};

        beforeEach(function () {
            angular.mock.module(/*'chpl.templates',*/ 'chpl.components');
            inject(function (_$compile_, _$log_, $rootScope, aiCmsWidgetDirective) {
                $compile = _$compile_;
                $log = _$log_;

                // replace ai-cms-widget controller with mock version
                var aiCmsWidgetDefinition = aiCmsWidgetDirective[0];
                aiCmsWidgetDefinition.link = angular.noop;
                mock.clearProducts = jasmine.createSpy('clearProducts');
                mock.create = jasmine.createSpy('create');
                mock.generatePdf = jasmine.createSpy('generatePdf');
                mock.removeProduct = jasmine.createSpy('removeProduct');
                aiCmsWidgetDefinition.controller = function () {
                    this.clearProducts = mock.clearProducts;
                    this.create = mock.create;
                    this.generatePdf = mock.generatePdf;
                    this.removeProduct = mock.removeProduct;
                }

                el = angular.element('<ai-cms-widget><ai-cms-widget-display widget="widget"></ai-cms-widget-display></ai-cms-widget>');
                scope = $rootScope.$new();
                $compile(el)(scope);
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

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should call the parent controllers on button clicks', function () {
            scope.widget = {
                searchResult: {
                    products: [
                        { productId: 1, name: 'fake' },
                    ],
                },
                productIds: [1],
            };
            $compile(el)(scope);
            scope.$digest();
            el.find('button').triggerHandler('click');
            expect(mock.clearProducts).not.toHaveBeenCalled();
            expect(mock.create).toHaveBeenCalled();
            expect(mock.generatePdf).not.toHaveBeenCalled();
            expect(mock.removeProduct).toHaveBeenCalled();
        });

        it('should call functions on the parent controller', function () {
            scope.widget = {
                createResponse: true,
                searchResult: {
                    products: [
                        { productId: 1, name: 'fake' },
                    ],
                },
                productIds: [1],
            };
            $compile(el)(scope);
            scope.$digest();
            el.find('button').triggerHandler('click');
            expect(mock.clearProducts).not.toHaveBeenCalled();
            expect(mock.create).not.toHaveBeenCalled();
            expect(mock.generatePdf).toHaveBeenCalled();
            expect(mock.removeProduct).toHaveBeenCalled();
        });

        it('should call the controller clearProducts on link click', function () {
            scope.widget = {
                searchResult: {
                    products: [
                        { productId: 1, name: 'fake' },
                    ],
                },
                productIds: [1],
            };
            $compile(el)(scope);
            scope.$digest();
            el.find('a').triggerHandler('click');
            expect(mock.clearProducts).toHaveBeenCalled();
            expect(mock.create).not.toHaveBeenCalled();
            expect(mock.generatePdf).not.toHaveBeenCalled();
            expect(mock.removeProduct).not.toHaveBeenCalled();
        });
    });
})();
