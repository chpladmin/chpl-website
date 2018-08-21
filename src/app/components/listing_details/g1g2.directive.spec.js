(function () {
    'use strict';

    describe('chpl. listing_details.aiG1G2Directive', function () {

        var $log, Mock, el, scope, vm;

        beforeEach(function () {
            angular.mock.module(/*'chpl.templates',*/ 'chpl.mock', 'chpl');
            inject(function ($compile, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                el = angular.element('<ai-g1g2 listing="listing"></ai-g1g2>');

                scope = $rootScope.$new();
                scope.listing = Mock.fullListings[1];
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

        describe('the directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('the controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
                expect(vm.listing).toEqual(Mock.fullListings[1]);
            });

            it('should have an array of measures with their criteria', function () {
                expect(vm.measures.length).toBeGreaterThan(0);
            });

            it('should change the structure of the measure to match the desired output', function () {
                expect(vm.measures[0]).toEqual({
                    name: 'Medication/Clinical Information Reconciliation: Eligible Provider Individual',
                    description: 'Required Test 9: Stage 2 Objective 7 and Stage 3 Objective 7 Measure 3',
                    g: 'G2',
                    criteria: ['170.315 (b)(2)'],
                    $$hashKey: jasmine.any(String),
                });
            });

            it('should combine matching measures on criteria value', function () {
                expect(vm.measures[4]).toEqual({
                    name: 'Electronic Prescribing: Eligible Clinician Group',
                    description: 'Required Test 1: Stage 2 Objective 4 and Stage 3 Objective 2, ACI Transition Objective 2 Measure 1 and ACI Objective 2 Measure 1',
                    g: 'G2',
                    criteria: ['170.315 (a)(10)', '170.315 (b)(3)'],
                    $$hashKey: jasmine.any(String),
                });
            });
        });
    });
})();
