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

        describe('apiDocumentation translation', function () {
            it('should filter on apiDocumentation', function () {
                expect(service.translate('apiDocumentation', {results: Mock.allCps}).length).toBe(2);
            });

            it('should generate a mainSearch', function () {
                var results = service.translate('apiDocumentation', {results: Mock.allCps});
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

        describe('transparencyAttestations translation', function () {
            var results;
            beforeEach(function () {
                results = service.translate('transparencyAttestations', Mock.collections.developers);
            });

            it('should filter on transparencyAttestations', function () {
                expect(results.length).toBe(4);
            });

            it('should generate a mainSearch', function () {
                expect(results[0].mainSearch).toEqual('ACL Laboratories');
            });

            it('should join Attestations', function () {
                expect(results[0].acbAttestations).toEqual('<strong>ICSA Labs</strong>: <span class="text-muted">Not Applicable</span>');
                expect(results[1].acbAttestations).toEqual('<strong>Drummond Group</strong>: <span class="text-success">Supports</span>');
                expect(results[2].acbAttestations).toEqual('<strong>ICSA Labs</strong>: <span class="text-success">Supports</span><br /><strong>InfoGard</strong>: <span class="text-success">Supports</span>');
                expect(results[3].acbAttestations).toEqual('<strong>InfoGard</strong>: <span class="text-success">Supports</span>');
            });

            it('should split Urls', function () {
                expect(results[0].transparencyAttestationUrls).toEqual([]);
                expect(results[1].transparencyAttestationUrls).toEqual(['http://fiehr.com/Support/Disclosures']);
                expect(results[2].transparencyAttestationUrls).toEqual(['http://www.asp.md/certified.htm']);
                expect(results[3].transparencyAttestationUrls).toEqual(['http://insynchcs.com/meaningful-use-certification.html', 'http://www.insynchcs.com/meaningful-use-certification']);
            });
        });
    });
})();
