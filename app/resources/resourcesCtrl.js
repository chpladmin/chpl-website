;(function () {
    'use strict';

    angular.module('app.resources')
        .controller('ResourcesController', ['$scope', '$log', '$location', 'API', 'authService', 'commonService', function($scope, $log, $location, API, authService, commonService) {
            var vm = this;
			vm.lookupCertIds = lookupCertIds;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
                if (vm.API === '/rest') {
                    vm.swaggerUrl = $location.absUrl().split('#')[0] + 'rest/api-docs';
                } else {
                    vm.swaggerUrl = vm.API + '/api-docs';
                }
            }

			function lookupCertIds () {
				vm.lookupProducts = null;

				if ((vm.lookup !== "undefined") && (vm.lookup.certIds !== "undefined")) {
					vm.lookup.certIds = vm.lookup.certIds.replace(/[;,\s]+/g, " ");
					vm.lookup.certIds = vm.lookup.certIds.trim().toUpperCase();

					// Check format of input
					if (null !== vm.lookup.certIds.match(/([0-9A-Z]{15}([;][0-9A-Z]{15})*)/i)) {

						// Split IDs
						var idArray = vm.lookup.certIds.split(/ /);
						vm.lookupProducts = null;

						// Call LookupAPI
						idArray.forEach(function (id) {
							commonService.lookupCertificationId(id)
								.then(function (data) {
									if (vm.lookupProducts === null)
										vm.lookupProducts = [];
									data.products.forEach(function (product) {
										product.certificationId = data.ehrCertificationId;
										product.certificationIdEdition = data.year;
										vm.lookupProducts.push(product);
									});

								}, function (error) {
									console.debug("Error: " + error);
									vm.lookupProducts = null;
								});
						});

					} else {
						vm.lookupProducts = null;
					}

				}
			}

        }]);
})();
