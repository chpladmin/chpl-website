;(function () {
    'use strict';

    describe('app.search.cert.directive', function () {

        var $compile;
        var $scope;
        var $log;

        beforeEach(module('app.search'));

        beforeEach(inject(function (_$compile_, $rootScope, _$log_) {
            $compile = _$compile_;
            $scope = $rootScope.$new();
            $log = _$log_;
            $scope.certFilters = Object.create(null);
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('calls the parent search function', function() {
            // arrange
            var stTableCtrl = {
                search: function () {}
            };
            spyOn(stTableCtrl, 'search');

            var element = angular.element('<div><ai-cert-filter></ai-cert-filter></div>');
            element.data('$stTableController', stTableCtrl);
            $compile(element)($scope)
            var aiScope = element.find('ai-cert-filter').scope();

            // act
            aiScope.certsChanged();

            // assert
            expect(stTableCtrl.search).toHaveBeenCalled();
        });
    });
})();
