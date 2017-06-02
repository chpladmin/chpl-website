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
                expect(service.translate('apiCriteria', {results: Mock.allCps}).length).toBe(2);
            });

            it('should generate a mainSearch', function () {
                var results = service.translate('apiCriteria', {results: Mock.allCps});
                expect(results[0].mainSearch).toEqual('Carefluence|Carefluence Open API|1.0|15.04.04.2649.Care.01.0.0.160701');
            });
        });

        describe('bannedDevelopers translation', function () {
            it('should filter on bannedDevelopers', function () {
                expect(service.translate('bannedDevelopers', Mock.decertifiedDevelopers).length).toBe(2);
            });

            it('should generate a mainSearch', function () {
                var results = service.translate('bannedDevelopers', Mock.decertifiedDevelopers);
                expect(results[0].mainSearch).toEqual('Greenway Health, LLC');
            });
        });

        describe('decertifiedProducts translation', function () {
            it('should filter on decertifiedProducts', function () {
                expect(service.translate('decertifiedProducts', {results: Mock.allCps}).length).toBe(1);
            });

            it('should generate a mainSearch', function () {
                var results = service.translate('decertifiedProducts', {results: Mock.allCps});
                expect(results[0].mainSearch).toEqual('Strateq Health Inc.|37 Degrees|V1.07|CHP-028979');
            });
        });

        describe('inactiveCertificates translation', function () {
            it('should filter on inactiveCertificates', function () {
                expect(service.translate('inactiveCertificates', {results: Mock.allCps}).length).toBe(1);
            });

            it('should generate a mainSearch', function () {
                var results = service.translate('inactiveCertificates', {results: Mock.allCps});
                expect(results[0].mainSearch).toEqual('Carefluence|Carefluence Open API|1.0|15.04.04.2649.Care.01.0.0.160701');
            });
        });

        describe('nonconformities translation', function () {
            it('should filter on nonconformities', function () {
                expect(service.translate('nonconformities', {results: Mock.allCps}).length).toBe(3);
            });

            it('should generate a mainSearch', function () {
                var results = service.translate('nonconformities', {results: Mock.allCps});
                expect(results[0].mainSearch).toEqual('DrScribe, Inc.|365EHR|4.0.14|CHP-026059');
            });
        });
    });
})();
