(function () {
    'use strict';

    describe('decertifications.developers.controller', function () {
        var vm, scope, $log, $q, commonService, mock, Mock;

        mock = {
            modifiedDecertifiedDevelopers: [
                {acb: ['Drummond Group'], decertificationDate: 1481938585744, developer: 'Greenway Health, LLC', status: 'Under certification ban by ONC'},
                {acb: ['ICSA Labs'], decertificationDate: 1490194030517, developer: '4Medica', status: 'Under certification ban by ONC'}
            ]
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
                //Mock.decertifiedDevelopers.decertifiedDeveloperResults[0].developer.decertificationDate = 1490126033141;
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
            expect(vm.decertifiedDevelopers.length).toBe(2);
        });

        it('should set the displayed Developers to match the found ones', function () {
            expect(vm.displayedDevelopers).toEqual(Mock.decertifiedDevelopers.decertifiedDeveloperResults);
        });

        it('should generate the smart-table fields', function () {
            expect(vm.modifiedDecertifiedDevelopers).toEqual(mock.modifiedDecertifiedDevelopers);
        });
    });
})();
