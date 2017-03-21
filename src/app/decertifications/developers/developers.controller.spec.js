(function () {
    'use strict';

    describe('decertifications.developers.controller', function () {
        var vm, scope, $log, $q, commonService, mock, Mock;

        mock = {
            modifiedDecertifiedDevelopers: [
                {developer: 'Greenway Health, LLC', acb: ['Drummond Group'], status: 'Under certification ban by ONC', decertificationDate: 1490126033141}],
            filter: { acb: 'Drummond', developer: 'epic', status: 'broke'}
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.decertifications', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getDecertifiedDevelopers = jasmine.createSpy('getDecertifiedDevelopers');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _$q_, _commonService_, _Mock_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                Mock.decertifiedDevelopers.decertifiedDeveloperResults[0].developer.decertificationDate = 1490126033141;
                commonService = _commonService_;
                commonService.getDecertifiedDevelopers.and.returnValue($q.when(Mock.decertifiedDevelopers));

                scope = $rootScope.$new();
                vm = $controller('DecertifiedDevelopersController', {
                    $scope: scope
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have called the commonService to load decertified Developers', function () {
            expect(commonService.getDecertifiedDevelopers).toHaveBeenCalled();
        });

        it('should know how many decertified Developers there are', function () {
            expect(vm.decertifiedDevelopers.length).toBe(1);
        });

        it('should set the displayed Developers to match the found ones', function () {
            expect(vm.displayedDevelopers).toEqual(Mock.decertifiedDevelopers.decertifiedDeveloperResults);
        });

        it('should generate the smart-table fields', function () {
            expect(vm.modifiedDecertifiedDevelopers).toEqual(mock.modifiedDecertifiedDevelopers);
        });
    });
})();
