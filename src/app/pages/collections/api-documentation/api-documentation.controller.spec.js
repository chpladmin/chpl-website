(function () {
  'use strict';

  describe('chpl.collections.apiDocumentation.controller', function () {

    var $log, $q, authService, networkService, scope, vm;

    beforeEach(function () {
      angular.mock.module('chpl.mock', 'chpl.collections', function ($provide) {
        $provide.decorator('authService', function ($delegate) {
          $delegate.getApiKey = jasmine.createSpy('getApiKey');
          return $delegate;
        });
        $provide.decorator('networkService', function ($delegate) {
          $delegate.getApiDocumentationDate = jasmine.createSpy('getApiDocumentationDate');
          return $delegate;
        });
      });

      inject(function ($controller, _$log_, _$q_, $rootScope, _authService_, _networkService_) {
        $log = _$log_;
        $q = _$q_;
        authService = _authService_;
        authService.getApiKey.and.returnValue('api-key');
        networkService = _networkService_;
        networkService.getApiDocumentationDate.and.returnValue($q.when({associatedDate: 39393939}));

        scope = $rootScope.$new();
        vm = $controller('ApiDocumentationController', {
          $scope: scope,
          networkService: networkService,
        });
        scope.$digest();
      });
    });

    afterEach(function () {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('on load', () => {
      it('should exist', function () {
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

    describe('transforming API Documentation data', function () {
      it('should return "Unknown" if no data', function () {
        var data;
        expect(vm.apiTransform(data)).toBe('Unknown');
      });

      it('should create a list of three elements if the APIs are all different', function () {
        var data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☹http://example2.com☺170.315 (g)(9)☹http://example3.com';
        let output = vm.apiTransform(data);
        expect(output.indexOf('<dt>170.315 (g)(7)</dt>')).toBeGreaterThan(-1);
        expect(output.indexOf('<dt>170.315 (g)(8)</dt>')).toBeGreaterThan(-1);
        expect(output.indexOf('<dt>170.315 (g)(9)</dt>')).toBeGreaterThan(-1);
      });

      it('should combine elements a list of three elements if the APIs the same', function () {
        var data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☹http://example1.com☺170.315 (g)(9)☹http://example1.com';
        let output = vm.apiTransform(data);
        expect(output.indexOf('<dt>170.315 (g)(7), 170.315 (g)(8), 170.315 (g)(9)</dt>')).toBeGreaterThan(-1);
      });

      it('should only have one element if only one api link', function () {
        var data = '170.315 (g)(7)☹http://example1.com☺170.315 (g)(8)☺170.315 (g)(9)☹';
        let output = vm.apiTransform(data);
        expect(output.indexOf('<dt>170.315 (g)(7)</dt>')).toBeGreaterThan(-1);
        expect(output.indexOf('170.315 (g)(8)')).toBe(-1);
        expect(output.indexOf('170.315 (g)(9)')).toBe(-1);
      });
    });

    describe('transforming Mandatory Disclosures data', function () {
      it('should return "Unknown" if no data', function () {
        var data;
        expect(vm.disclosuresTransform(data)).toBe('Unknown');
      });

      it('should a link for the data', function () {
        var data = 'http://example.com';
        let output = vm.disclosuresTransform(data);
        expect(output.indexOf('<a ai-a href="http://example.com"')).toBeGreaterThan(-1);
      });
    });
  });
})();
