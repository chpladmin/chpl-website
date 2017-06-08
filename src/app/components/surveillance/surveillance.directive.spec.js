(function () {
    'use strict';

    describe('surviellance directive', function () {
        var vm, el, $q, $log, commonService;

        beforeEach(function () {
            module('chpl.templates');
            module('chpl', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, _$q_, $rootScope, _commonService_) {
                $q = _$q_;
                $log = _$log_;
                commonService = _commonService_;
                commonService.getSurveillanceLookups.and.returnValue($q.when({}));

                el = angular.element('<ai-surveillance></ai-surveillance>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
        });

        it('should come up with correct titles', function () {
            var surv = {
                endDate: new Date('Wed, 30 Mar 2016 00:00:00 GMT'),
                friendlyId: 'SURV01',
                requirements: [{nonconformities: []}],
            };
            expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: No Open Non-Conformities Found');
        });
    });
})();
