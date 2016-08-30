;(function () {
    'use strict';

    angular.module('app.search')
        .controller('CertIdController', ['$scope', 'CACHE_TIMEOUT', function ($scope, CACHE_TIMEOUT) {
            var vm = this;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
				// Execute after page is loaded so jquery can find elements
				angular.element(document).ready(function() {
					if (typeof chplCertIdWidgetLogin !== 'undefined') {
						chplCertIdWidgetLogin.setup();
						chplCertIdWidget.invokeGetCertificationId(null, null, false);
						chplCertIdWidget.setCollectionChangeCallback(function() { $scope.$applyAsync(); });
					}
				});
            }
        }]);
})();
