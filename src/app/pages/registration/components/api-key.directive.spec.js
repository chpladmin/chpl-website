(function () {
  'use strict';

  describe('chpl.registration.apiKey.directive', function () {

    var $log, $q, ctrl, mockCommonService, networkService, scope;

    beforeEach(function () {
      mockCommonService = {};

      angular.mock.module('chpl.registration', function ($provide) {
        $provide.value('networkService', mockCommonService);
      });

      mockCommonService.apiUsers = [{name: 'test', email: 'test', key: 'test'}];
      mockCommonService.fakeUser = {name: 'fake', email: 'fake@fake.com', key: 'userKey'};
      mockCommonService.registered = {keyRegistered: 'fake key'};

      inject(function ($q) {
        mockCommonService.getApiUsers = function () { return $q.when(mockCommonService.apiUsers); };
        mockCommonService.revokeApi = function () { return $q.when({}); };
      });
    });

    beforeEach(inject(function ($compile, $rootScope) {
      scope = $rootScope.$new();

      var element = angular.element('<ai-api-key admin="true"></ai-api-key>');
      $compile(element)(scope);
      scope.$digest();
    }));

    afterEach(function () {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        //console.log('Debug:\n' + angular.toJson($log.debug.logs));
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('controller', function () {

      beforeEach(inject(function ($controller, _$log_, _$q_, $rootScope, _networkService_) {
        $log = _$log_;
        scope = $rootScope.$new();
        networkService = _networkService_;
        $q = _$q_;

        ctrl = $controller('ApiKeyController', {
          $element: null,
          networkService: networkService,
        });
        scope.$digest();
      }));

      it('should exist', function () {
        expect(ctrl).toBeDefined();
      });

      it('should have no key on load', function () {
        expect(ctrl.hasKey).toBeFalsy();
        expect(ctrl.key).toBeUndefined();
      });

      it('should call the common service to load users', function () {
        spyOn(networkService, 'getApiUsers').and.callThrough();
        ctrl.loadUsers();
        expect(networkService.getApiUsers).toHaveBeenCalled();
      });

      it('should load users', function () {
        expect(ctrl.users).toBeUndefined();
        spyOn(networkService, 'getApiUsers').and.returnValue($q.when([{}]));
        ctrl.loadUsers();
        scope.$digest();
        expect(ctrl.users.length).toBe(1);
      });

      it('should log an error if getApiUsers fails', function () {
        var deferred = $q.defer();
        spyOn(networkService, 'getApiUsers').and.returnValue(deferred.promise);
        ctrl.loadUsers();
        deferred.reject('expected error');
        scope.$digest();
        expect($log.debug.logs.length).toBeGreaterThan(0);
      });

      it('should revoke a user with valid components and refresh', function () {
        spyOn(networkService, 'revokeApi').and.callThrough();
        spyOn(networkService, 'getApiUsers').and.returnValue($q.when([{}]));
        ctrl.revoke(mockCommonService.fakeUser);
        scope.$digest();
        expect(networkService.revokeApi).toHaveBeenCalled();
        expect(networkService.getApiUsers).toHaveBeenCalled();
      });

      it('should log an error if revokeApi fails', function () {
        var deferred = $q.defer();
        spyOn(networkService, 'revokeApi').and.returnValue(deferred.promise);
        ctrl.revoke(mockCommonService.fakeUser);
        deferred.reject('expected error');
        scope.$digest();
        expect($log.debug.logs.length).toBeGreaterThan(0);
      });

      it('should not call revokeApi if key is blank', function () {
        var user = mockCommonService.fakeUser;
        delete (user.key);
        spyOn(networkService, 'revokeApi').and.callThrough();
        ctrl.revoke(user);
        scope.$digest();
        expect(networkService.revokeApi.calls.any()).toBeFalsy();
      });
    });
  });
})();
