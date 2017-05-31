(function () {
    'use strict';

    describe('chpl.collections.developers.controller', function () {

        var commonService, scope, vm, $log, $q, Mock, mock;
        mock = {
            modifiedDecertifiedDevelopers: [
                {acb: ['Drummond Group'], decertificationDate: 1481938585744, developer: 'Greenway Health, LLC', status: 'Under certification ban by ONC'},
                {acb: ['ICSA Labs'], decertificationDate: 1490194030517, developer: '4Medica', status: 'Under certification ban by ONC'},
            ],
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getDecertifiedDevelopers = jasmine.createSpy('getDecertifiedDevelopers');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.getDecertifiedDevelopers.and.returnValue($q.when(Mock.decertifiedDevelopers));

                scope = $rootScope.$new();
                vm = $controller('DecertifiedDevelopersController', {
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

        it('should have called the commonService to load decertified Developers', function () {
            expect(commonService.getDecertifiedDevelopers).toHaveBeenCalled();
        });

        it('should know how many decertified Developers there are', function () {
            expect(vm.allDevelopers.length).toBe(2);
        });

        it('should generate the smart-table fields', function () {
            expect(vm.allDevelopers).toEqual(mock.modifiedDecertifiedDevelopers);
        });
    });
})();
