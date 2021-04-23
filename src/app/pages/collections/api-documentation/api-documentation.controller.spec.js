(() => {
  describe('chpl.collections.apiDocumentation.controller', () => {
    let $log;
    let $q;
    let authService;
    let networkService;
    let scope;
    let vm;

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.collections', ($provide) => {
        $provide.decorator('authService', ($delegate) => ({ ...$delegate, getApiKey: jasmine.createSpy('getApiKey') }));
        $provide.decorator('networkService', ($delegate) => ({ ...$delegate, getApiDocumentationDate: jasmine.createSpy('getApiDocumentationDate') }));
      });

      inject(($controller, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
        $log = _$log_;
        $q = _$q_;
        authService = _authService_;
        authService.getApiKey.and.returnValue('api-key');
        networkService = _networkService_;
        networkService.getApiDocumentationDate.and.returnValue($q.when({ associatedDate: 39393939 }));

        scope = $rootScope.$new();
        vm = $controller('ApiDocumentationController', {
          $scope: scope,
          networkService,
        });
        scope.$digest();
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('on load', () => {
      it('should exist', () => {
        expect(vm).toBeDefined();
      });

      it('should call the network service for the last modified date', () => {
        expect(networkService.getApiDocumentationDate.calls.count()).toBe(1);
      });

      it('should call the auth service for the api key', () => {
        expect(authService.getApiKey.calls.count()).toBe(1);
      });

      it('should have the link to the download file', () => {
        expect(vm.apiDocument).toBe('/rest/files/api_documentation?api_key=api-key');
      });

      it('should know what the last updated date is', () => {
        expect(vm.apiDate).toBe(39393939);
      });
    });

    describe('transforming API Documentation data', () => {
      it('should return "N/A" if no data', () => {
        let data;
        expect(vm.apiTransform(data)).toBe('N/A');
      });

      it('should create a list of three elements if the APIs are all different', () => {
        const data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☹http://example2.com☺170.315 (g)(9)☹http://example3.com';
        const output = vm.apiTransform(data);
        expect(output.indexOf('<dt>170.315 (g)(7)</dt>')).toBeGreaterThan(-1);
        expect(output.indexOf('<dt>170.315 (g)(8)</dt>')).toBeGreaterThan(-1);
        expect(output.indexOf('<dt>170.315 (g)(9)</dt>')).toBeGreaterThan(-1);
      });

      it('should combine elements a list of three elements if the APIs the same', () => {
        const data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☹http://example1.com☺170.315 (g)(9)☹http://example1.com';
        const output = vm.apiTransform(data);
        expect(output.indexOf('<dt>170.315 (g)(7), 170.315 (g)(8), 170.315 (g)(9)</dt>')).toBeGreaterThan(-1);
      });

      it('should only have one element if only one api link', () => {
        const data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☺170.315 (g)(9)☹';
        const output = vm.apiTransform(data);
        expect(output.indexOf('<dt>170.315 (g)(7)</dt>')).toBeGreaterThan(-1);
        expect(output.indexOf('170.315 (g)(8)')).toBe(-1);
        expect(output.indexOf('170.315 (g)(9)')).toBe(-1);
      });
    });

    describe('transforming Mandatory Disclosures data', () => {
      it('should return "Unknown" if no data', () => {
        let data;
        expect(vm.disclosuresTransform(data)).toBe('Unknown');
      });

      it('should a link for the data', () => {
        const data = 'http://example.com';
        const output = vm.disclosuresTransform(data);
        expect(output.indexOf('<a ai-a href="http://example.com"')).toBeGreaterThan(-1);
      });
    });
  });
})();
