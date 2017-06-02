(function () {
    'use strict';

    describe('chpl.collections.service', function () {

        beforeEach(module('chpl.collections', 'chpl.mock'));

        var $log, Mock, service;

        beforeEach(inject(function (_$log_, _Mock_, _collectionsService_) {
            $log = _$log_;
            Mock = _Mock_;
            service = _collectionsService_;
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('apiCriteria translation', function () {
            it('should filter on apiCriteria', function () {
                expect(service.translate('apiCriteria', Mock.allCps).length).toBe(1);
            });

            it('should generate a mainSearch', function () {
                var results = service.translate('apiCriteria', Mock.allCps);
                expect(results[0].mainSearch).toEqual('Carefluence|Carefluence Open API|1.0|15.04.04.2649.Care.01.0.0.160701');
            });
        });
    });
})();
