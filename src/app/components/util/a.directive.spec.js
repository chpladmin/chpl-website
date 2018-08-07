(function () {
    'use strict';

    describe('chpl.a.directive', function () {

        var el;
        var $log;

        beforeEach(function () {
            module('chpl')
        });

        beforeEach(inject(function ($compile, _$log_, $rootScope) {
            $log = _$log_;

            el = angular.element('<a ai-a href="link">text</a>');
            $compile(el)($rootScope.$new());
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('template', function () {
            it('should have the disclaimer link', function () {
                expect(el.html()).toBe('text<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right"><i class="fa fa-external-link"></i><span class="sr-only">Web Site Disclaimers</span></a>');
            });
        });
    });
})();
