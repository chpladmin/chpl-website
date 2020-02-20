(() => {
    'use strict';

    describe('the Collections Service', () => {

        beforeEach(angular.mock.module('chpl.collections', 'chpl.mock'));

        var $log, Mock, mock, service;
        mock = {
            certificationCriteria: [
                {number: '170.315 (g)(3)', title: 'Safety-Enhanced Design'},
                {number: '170.315 (g)(7)', title: 'Application Access - Patient Selection'},
                {number: '170.315 (g)(8)', title: 'Application Access - Data Category'},
                {number: '170.315 (g)(9)', title: 'Application Access - All Data Request'},
                {number: '170.315 (g)(9)', title: 'Application Access - All Data Request (Cures Update)'},
                {number: '170.315 (g)(10)', title: 'Standardized API for Patient and Population Services'},
            ],
        }

        beforeEach(inject((_$log_, _Mock_, _collectionsService_) => {
            $log = _$log_;
            Mock = _Mock_;
            service = _collectionsService_;
        }));

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('when focused on apiDocumentation', () => {
            it('should filter on apiDocumentation', () => {
                expect(service.translate('apiDocumentation', {results: Mock.allCps, certificationCriteria: [mock.certificationCriteria]}).length).toBe(2);
            });

            it('should generate a mainSearch', () => {
                var results = service.translate('apiDocumentation', {results: Mock.allCps, certificationCriteria: [mock.certificationCriteria]});
                expect(results[0].mainSearch).toEqual('Carefluence|Carefluence Open API|1.0|15.04.04.2649.Care.01.0.0.160701');
            });
        });

        describe('when focused on bannedDevelopers', () => {
            it('should filter on bannedDevelopers', () => {
                expect(service.translate('bannedDevelopers', Mock.decertifiedDevelopers).length).toBe(2);
            });

            it('should generate a mainSearch', () => {
                var results = service.translate('bannedDevelopers', Mock.decertifiedDevelopers);
                expect(results[0].mainSearch).toEqual('Cerner Corporation');
            });
        });

        describe('when focused on correctiveAction', () => {
            var results;
            beforeEach(() => {
                results = service.translate('correctiveAction', {results: Mock.allCps});
            });

            it('should filter on correctiveAction', () => {
                expect(results.length).toBe(3);
            });

            it('should generate a mainSearch', () => {
                expect(results[0].mainSearch).toEqual('DrScribe, Inc.|365EHR|4.0.14|CHP-026059');
            });

            it('should generate a nonconformity json element', () => {
                expect(results[0].nonconformities).toEqual('{"openNonconformityCount":2,"closedNonconformityCount":0}');
            });
        });

        describe('when focused on decertifiedProducts', () => {
            it('should filter on decertifiedProducts', () => {
                expect(service.translate('decertifiedProducts', {results: Mock.allCps}).length).toBe(1);
            });

            it('should generate a mainSearch', () => {
                var results = service.translate('decertifiedProducts', {results: Mock.allCps});
                expect(results[0].mainSearch).toEqual('Strateq Health Inc.|37 Degrees|V1.07|CHP-028979');
            });
        });

        describe('when focused on inactiveCertificates', () => {
            it('should filter on inactiveCertificates', () => {
                expect(service.translate('inactiveCertificates', {results: Mock.allCps}).length).toBe(1);
            });

            it('should generate a mainSearch', () => {
                var results = service.translate('inactiveCertificates', {results: Mock.allCps});
                expect(results[0].mainSearch).toEqual('Carefluence|Carefluence Open API|1.0|15.04.04.2649.Care.01.0.0.160701');
            });
        });

        describe('when focused on sed', () => {
            it('should filter on sed', () => {
                expect(service.translate('sed', {results: Mock.allCps, certificationCriteria: [mock.certificationCriteria]}).length).toBe(1);
            });

            it('should generate a mainSearch', () => {
                var results = service.translate('sed', {results: Mock.allCps, certificationCriteria: [mock.certificationCriteria]});
                expect(results[0].mainSearch).toEqual('Healthland|Centriq Clinic|12|15.07.07.2751.CE03.01.00.1.170823');
            });
        });

        describe('when focused on transparencyAttestations', () => {
            var results;
            beforeEach(() => {
                results = service.translate('transparencyAttestations', Mock.collections.developers);
            });

            it('should filter on transparencyAttestations', () => {
                expect(results.length).toBe(4);
            });

            it('should generate a mainSearch', () => {
                expect(results[0].mainSearch).toEqual('ACL Laboratories');
            });

            it('should join Attestations', () => {
                expect(results[0].acbAttestations).toEqual('<span class="text-muted">Not Applicable (ICSA Labs)</span>');
                expect(results[1].acbAttestations).toEqual('<span class="text-success">Supports (Drummond Group)</span>');
                expect(results[2].acbAttestations).toEqual('<span class="text-success">Supports (ICSA Labs)</span><br /><span class="text-success">Supports (UL LLC)</span>');
                expect(results[3].acbAttestations).toEqual('<span class="text-success">Supports (UL LLC)</span>');
            });

            it('should split Urls', () => {
                expect(results[0].transparencyAttestationUrls).toEqual([]);
                expect(results[1].transparencyAttestationUrls).toEqual(['http://fiehr.com/Support/Disclosures']);
                expect(results[2].transparencyAttestationUrls).toEqual(['http://www.asp.md/certified.htm']);
                expect(results[3].transparencyAttestationUrls).toEqual(['http://insynchcs.com/meaningful-use-certification.html', 'http://www.insynchcs.com/meaningful-use-certification']);
            });
        });
    });
})();
