(function () {
    'use strict';

    describe('chpl.collections.inactive.controller', function () {

        var commonService, scope, vm, $log, $q, Mock, mock;
        mock = {
            muuAccurateAsOfDate: (new Date('2017-01-13')).getTime(),
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getCollection = jasmine.createSpy('getCollection');
                    $delegate.getMeaningfulUseUsersAccurateAsOfDate = jasmine.createSpy('getMeaningfulUseUsersAccurateAsOfDate');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.getCollection.and.returnValue($q.when({'results': Mock.allNonconformities}));
                commonService.getMeaningfulUseUsersAccurateAsOfDate.and.returnValue($q.when({accurateAsOfDate: mock.muuAccurateAsOfDate}));
                commonService.getSearchOptions.and.returnValue($q.when(Mock.search_options));

                scope = $rootScope.$new();
                vm = $controller('InactiveCertificatesController', {
                    $scope: scope,
                    commonService: commonService,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have called the commonService to load Inactive Certifications', function () {
            expect(commonService.getCollection).toHaveBeenCalled();
        });

        it('should know what the muu_accurate_as_of_date is', function () {
            expect(vm.muuAccurateAsOf).toEqual(mock.muuAccurateAsOfDate);
        });
    });
})();
