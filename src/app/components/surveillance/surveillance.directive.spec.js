(function () {
    'use strict';

    describe('surveillance directive', function () {
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

        describe('surveillance titles', function () {
            it('should come up with correct titles when there were no NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 00:00:00 GMT'),
                    requirements: [{nonconformities: []}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: No Non-Conformities Were Found');
            });

            it('should come up with correct titles when there was 1 open NC', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 00:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Open'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Open Non-Conformity Was Found');
            });

            it('should come up with correct titles when there were multiple open NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 00:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Open'}}]}, {nonconformities: [{status: {name: 'Open'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 2 Open Non-Conformities Were Found');
            });

            it('should come up with correct titles when there was 1 closed NC', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 00:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Closed'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Closed Non-Conformity Was Found');
            });

            it('should come up with correct titles when there were multiple closed NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 00:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Closed'}}]}, {nonconformities: [{status: {name: 'Closed'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 2 Closed Non-Conformities Were Found');
            });

            it('should come up with correct titles when there were open and closed NCs', function () {
                var surv = {
                    endDate: new Date('Wed, 30 Mar 2016 00:00:00 GMT'),
                    requirements: [{nonconformities: [{status: {name: 'Open'}}]}, {nonconformities: [{status: {name: 'Closed'}}]}],
                };
                expect(vm.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Open and 1 Closed Non-Conformities Were Found');
            });
        });
    });
})();
