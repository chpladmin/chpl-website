'use strict';

describe('the search results download component,', () => {
    var $log, Mock, ctrl, el, mock, scope, utilService;

    mock = {
        listings: [],
        categories: [
            { display: 'Edition', enabled: true, columns: [{ display: 'Edition', key: 'edition' }] },
            { display: 'Product data', enabled: true, columns: [
                { display: 'Developer', key: 'developer' },
                { display: 'Product', key: 'product' },
                { display: 'Version', key: 'version' },
            ]},
            { display: 'Certification Date', enabled: true, columns: [{ display: 'Certification Date', key: 'certificationDate', transform: date => 'do the filter' + date }] },
            { display: 'CHPL ID', enabled: true, columns: [{ display: 'CHPL ID', key: 'chplProductNumber' }] },
            { display: 'Status', enabled: true, columns: [{ display: 'Status', key: 'certificationStatus' }] },
            { display: 'Details', enabled: true, columns: [{ display: 'Details', key: 'id', transform: id => 'http://chpl.healthit.gov/#/product/' + id }] },
            { display: 'Criteria', enabled: false, columns: [{ display: '170.315 (a)(1)', key: '170315a1' }] },
        ],
    };

    beforeEach(() => {
        angular.mock.module('chpl.mock', 'chpl.search', $provide => {
            $provide.decorator('utilService', $delegate => {
                $delegate.makeCsv = jasmine.createSpy('makeCsv');
                return $delegate;
            });
        });

        inject(($compile, _$log_, $rootScope, _Mock_, _utilService_) => {
            $log = _$log_;
            Mock = _Mock_;
            utilService = _utilService_;
            utilService.makeCsv.and.returnValue();

            scope = $rootScope.$new();
            scope.listings = Mock.allCps;
            scope.categories = mock.categories
            scope.maxSize = 50;

            el = angular.element('<ai-results-download listings="listings" categories="categories" max-size="{{ scope.maxSize }}"></ai-results-download>');

            $compile(el)(scope);
            scope.$digest();
            ctrl = el.isolateScope().$ctrl;
        });
    });

    afterEach(() => {
        if ($log.debug.logs.length > 0) {
            /* eslint-disable no-console,angular/log */
            console.log('Debug:\n' + $log.debug.logs.map((o) => angular.toJson(o)).join('\n'));
            /* eslint-enable no-console,angular/log */
        }
    });

    it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
    });

    describe('should use the util service', () => {
        it('to make a csv', () => {
            ctrl.getCsv();
            expect(utilService.makeCsv).toHaveBeenCalled();
        });
    });

    describe('when generating the csv download,', () => {
        it('should create a data object with a name and a header row', () => {
            ctrl.makeCsv();
            expect(ctrl.csvData.name).toBe('search-results.csv');
            expect(ctrl.csvData.values[0]).toEqual([
                'Edition', 'Developer', 'Product', 'Version', 'Certification Date', 'CHPL ID', 'Status', 'Details',
            ]);
        });

        it('should have data rows', () => {
            ctrl.makeCsv();
            expect(ctrl.csvData.values.length).toBe(9);
            expect(ctrl.csvData.values[1]).toEqual([
                '2014', 'Systemedx Inc', '2013 Systemedx Clinical Navigator', '2013.12', 'do the filter1396497600000', 'CHP-022218', 'Active', 'http://chpl.healthit.gov/#/product/296',
            ]);
        });
    });

    describe('when updating values,', () => {
        it('should update when categories change', () => {
            let cats = angular.copy(mock.categories);
            cats[1].enabled = false;
            ctrl.$onChanges({ categories: { currentValue: cats }});
            ctrl.makeCsv();
            expect(ctrl.csvData.values[0]).toEqual([
                'Edition', 'Certification Date', 'CHPL ID', 'Status', 'Details',
            ]);
        });
    });
});
