(function () {
    'use strict';

    describe('apiCriteriaFilter', function () {

        var aiFilter, $log, Mock;

        beforeEach(function () {
            module('chpl.collections', 'chpl.mock');

            inject(function (_$log_, _Mock_, apiCriteriaFilterFilter) {
                $log = _$log_;
                Mock = _Mock_;
                aiFilter = apiCriteriaFilterFilter;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('whould filter on text', function () {
            expect(aiFilter(Mock.allCps, {edition: '2015'}).length).toBe(4);
        });
    });
})();
