(function () {
    'use strict';

    describe('the Jobs Management', function () {
        var $compile, $log, $q, $timeout, el, mock, networkService, scope, vm;

        mock = {
            jobs: [
                {id: 1, status: {status: 'In Progress'}},
                {id: 2, status: {status: 'Complete'}},
            ],
        }

        beforeEach(function () {
            module('chpl.templates', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getJobTypes = jasmine.createSpy('getJobTypes');
                    $delegate.getJobs = jasmine.createSpy('getJobs');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, _$q_, $rootScope, _$timeout_, _$uibModal_, _networkService_) {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $timeout = _$timeout_;
                networkService = _networkService_;
                networkService.getJobTypes.and.returnValue($q.when([1,2]));
                networkService.getJobs.and.returnValue($q.when({results: mock.jobs}));

                el = angular.element('<ai-jobs-management></ai-jobs-management>');

                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                scope.vm = vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
            });

            it('should call the service to load jobs on load', function () {
                expect(networkService.getJobs).toHaveBeenCalled();
            });

            it('should load jobs on load', function () {
                expect(vm.jobs.length).toBe(2);
            });

            it('should call the service to load job types on load', function () {
                expect(networkService.getJobTypes).toHaveBeenCalled();
            });

            it('should load job types on load', function () {
                expect(vm.jobTypes.length).toBe(2);
            });

            describe('when refreshing jobs', function () {
                it('should refresh regularly', function () {
                    expect(networkService.getJobs.calls.count()).toBe(1);
                    $timeout.flush();
                    expect(networkService.getJobs.calls.count()).toBe(2);
                    $timeout.flush();
                    expect(networkService.getJobs.calls.count()).toBe(3);
                });

                it('should cancel the timeout on scope destroy', function () {
                    spyOn($timeout, 'cancel');
                    expect($timeout.cancel).not.toHaveBeenCalled();
                    el.isolateScope().$destroy();
                    expect($timeout.cancel).toHaveBeenCalled();
                });
            });
        });
    });
})();
