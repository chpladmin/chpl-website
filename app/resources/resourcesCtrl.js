;(function () {
    'use strict';

    angular.module('app.resources')
        .controller('ResourcesController', ['$scope', '$log', '$location', 'API', 'authService', 'commonService', function($scope, $log, $location, API, authService, commonService) {
            var vm = this;
			vm.lookupCertIds = lookupCertIds;
			vm.download = download;

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
			
			function convertArrayOfObjectsToCSV(args) {  
				var result, ctr, keys, columnDelimiter, lineDelimiter, data;

				data = args.data || null;
				if (data == null || !data.length) {
					return null;
				}

				columnDelimiter = args.columnDelimiter || ',';
				lineDelimiter = args.lineDelimiter || '\n';

				// Collection columns and remove the "$$hashKey" column
				keys = Object.keys(data[0]);
				keys.pop();

				result = '';
				result += keys.join(columnDelimiter);
				result += lineDelimiter;

				data.forEach(function(item) {
					ctr = 0;
					keys.forEach(function(key) {
						if (ctr > 0) result += columnDelimiter;

						result += "\"" + item[key] + "\"";
						ctr++;
					});
					result += lineDelimiter;
				});

				return result;
			}			

			function download(args) {  
				var filename = "lookupResults" + new Date().getTime() + ".csv";
				var data, link;
				var csv = convertArrayOfObjectsToCSV({
					data: vm.lookupProducts
				});
				if (csv == null) return;

				//filename = args.filename || 'export.csv';

				if (!csv.match(/^data:text\/csv/i)) {
					csv = 'data:text/csv;charset=utf-8,' + csv;
				}
				data = encodeURI(csv);

				link = document.createElement('a');
				link.setAttribute('href', data);
				link.setAttribute('download', filename);
				link.click();
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
