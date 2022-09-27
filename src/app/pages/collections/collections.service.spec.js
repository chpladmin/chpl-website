(() => {
  'use strict';

  describe('the Collections Service', () => {

    beforeEach(angular.mock.module('chpl.collections', 'chpl.mock'));

    var $log, Mock, service;

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

    describe('when focused on correctiveAction', () => {
      var results;
      beforeEach(() => {
        results = service.translate('correctiveAction', {results: Mock.allCps});
      });

      it('should filter on correctiveAction', () => {
        expect(results.length).toBe(1);
      });

      it('should generate a mainSearch', () => {
        expect(results[0].mainSearch).toEqual('Carefluence|Carefluence Open API|1|15.04.04.2657.Care.01.00.0.160701');
      });

      it('should generate a nonconformity json element', () => {
        expect(results[0].nonconformities).toEqual('{"openNonConformityCount":0,"closedNonConformityCount":6}');
      });
    });

    describe('when focused on decertifiedProducts', () => {
      it('should filter on decertifiedProducts', () => {
        expect(service.translate('decertifiedProducts', {results: Mock.allCps}).length).toBe(0);
      });

      xit('should generate a mainSearch', () => {
        var results = service.translate('decertifiedProducts', {results: Mock.allCps});
        expect(results[0].mainSearch).toEqual('Strateq Health Inc.|37 Degrees|V1.07|CHP-028979');
      });
    });

    describe('when focused on inactiveCertificates', () => {
      it('should filter on inactiveCertificates', () => {
        expect(service.translate('inactiveCertificates', {results: Mock.allCps}).length).toBe(4);
      });

      it('should generate a mainSearch', () => {
        var results = service.translate('inactiveCertificates', {results: Mock.allCps});
        expect(results[0].mainSearch).toEqual('OSEHRA|OSEHRA popHealth for Eligible Hospital|4.0.2|CHP-029007');
      });
    });

    describe('when focused on sed', () => {
      it('should filter on sed', () => {
        expect(service.translate('sed', {results: Mock.allCps, certificationCriteria: [Mock.searchOptions.certificationCriteria]}).length).toBe(0);
      });

      xit('should generate a mainSearch', () => {
        var results = service.translate('sed', {results: Mock.allCps, certificationCriteria: [Mock.searchOptions.certificationCriteria]});
        expect(results[0].mainSearch).toEqual('Healthland|Centriq Clinic|12|15.07.07.2751.CE03.01.00.1.170823');
      });
    });
  });
})();
