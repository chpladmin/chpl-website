(function () {
    'use strict';

    fdescribe('the search results download component', function () {
        var $log, Mock, ctrl, el, mock, scope, utilService;

        let getLink = id => 'http://chpl.healthit.gov/#/product/' + id;
        let makeDate = date => 'do the filter' + date;
        mock = {
            listings: [],
            columns: [
                { display: 'Edition', key: 'edition' },
                { display: 'Developer', key: 'developer' },
                { display: 'Product', key: 'product' },
                { display: 'Version', key: 'version' },
                { display: 'Certification Date', key: 'certificationDate', transform: makeDate },
                { display: 'CHPL ID', key: 'chplProductNumber' },
                { display: 'Status', key: 'certificationStatus' },
                { display: 'Details', key: 'id', transform: getLink },
            ],
        };

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl', function ($provide) {
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.makeCsv = jasmine.createSpy('makeCsv');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, $rootScope, _Mock_, _utilService_) {
                $log = _$log_;
                Mock = _Mock_;
                utilService = _utilService_;
                utilService.makeCsv.and.returnValue();

                scope = $rootScope.$new();
                scope.listings = Mock.allCps;
                scope.columns = mock.columns;

                el = angular.element('<ai-results-download listings="listings" columns="columns" max-size="50"></ai-results-download>');

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

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        describe('should use the util service', function () {
            it('to make a csv', function () {
                ctrl.getCsv();
                expect(utilService.makeCsv).toHaveBeenCalled();
            });
        });

        describe('for the csv download', function () {
            it('should create a data object with a name and a header row', function () {
                expect(ctrl.csvData.name).toBe('search-results.csv');
                expect(ctrl.csvData.values[0]).toEqual([
                    'Edition', 'Developer', 'Product', 'Version', 'Certification Date', 'CHPL ID', 'Status', 'Details',
                ]);
            });

            it('should have data rows', function () {
                expect(ctrl.csvData.values.length).toBe(9);
                expect(ctrl.csvData.values[1]).toEqual([
                    '2014', 'Systemedx Inc', '2013 Systemedx Clinical Navigator', '2013.12', 'do the filter1396497600000', 'CHP-022218', 'Active', 'http://chpl.healthit.gov/#/product/296',
                ]);
            });
        });
    });
})();
