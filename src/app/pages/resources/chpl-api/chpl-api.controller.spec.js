(() => {
  describe('the CHPL API component', () => {
    let $log;
    let scope;
    let vm;

    beforeEach(() => {
      angular.mock.module('chpl.resources', 'chpl.constants');

      inject(($controller, _$log_, $rootScope) => {
        $log = _$log_;

        scope = $rootScope.$new();
        vm = $controller('ChplApiController', {
          $scope: scope,
        });
        scope.$digest();
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        console.log(`Debug:\n${angular.toJson($log.debug.logs)}`);
      }
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(vm).toBeDefined();
      });
    });
  });
})();
