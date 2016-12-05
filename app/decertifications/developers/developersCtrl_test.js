(function() {
    'use strict';

    describe('decertifications.developers.controller', function() {
        var vm, scope, ctrl, $log, $timeout, $q, commonService, mock;

        mock = {
            decertifiedDevelopers: [
                {developer: {name: 'dev 1', status: {name: 'Terminated by ONC'}}, certifyingBody: [{name: 'acb1'},{name: 'acb2'}], estimatedUsers: 4},
                {developer: {name: 'dev 2', status: {name: 'Under certification ban by ONC'}}, certifyingBody: [{name: 'acb2'}], estimatedUsers: 6}],
            modifiedDecertifiedDevelopers: [
                {stDeveloper: 'dev 1', stAcb: ['acb1','acb2'], stStatus: 'Terminated by ONC', stEstimatedUsers: 4},
                {stDeveloper: 'dev 2', stAcb: ['acb2'], stStatus: 'Under certification ban by ONC', stEstimatedUsers: 6}],
            filter: { acb: 'Drummond', developer: 'epic', status: 'broke'},
            searchOptions: {
                certBodyNames: [{name: 'ICSA Labs'}, {name: 'Drummond Group'}, {name: 'Infogard'}],
                developerStatuses: [{name: 'Under certification ban by ONC'}, {name: 'Terminated by ONC'}]
            }
        };

        beforeEach(function () {
            module('app.decertifications', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getDecertifiedDevelopers = jasmine.createSpy('getDecertifiedDevelopers');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function($controller, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getDecertifiedDevelopers.and.returnValue($q.when({developerDecertificationResult: mock.decertifiedDevelopers}));
                commonService.getSearchOptions.and.returnValue($q.when(mock.searchOptions));

                scope = $rootScope.$new();
                vm = $controller('DecertifiedDevelopersController', {
                    $scope: scope
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have called the commonService to load decertified Developers', function () {
            expect(commonService.getDecertifiedDevelopers).toHaveBeenCalled();
        });

        it('should know how many decertified Developers there are', function () {
            expect(vm.decertifiedDevelopers.length).toBe(2);
        });

        it('should set the displayed Developers to match the found ones', function () {
            expect(vm.displayedDevelopers).toEqual(mock.decertifiedDevelopers);
        });

        it('should load the ACBs at page load', function () {
            expect(vm.acbs).toEqual(mock.searchOptions.certBodyNames);
        });

        it('should load the developer statuses at page load', function () {
            expect(vm.statuses).toEqual(mock.searchOptions.developerStatuses);
        });

        it('should generate the smart-table fields', function () {
            expect(vm.modifiedDecertifiedDevelopers).toEqual(mock.modifiedDecertifiedDevelopers);
        });
    });
})();
