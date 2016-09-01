;(function () {
    'use strict';

    angular.module('app.resources')
        .controller('ResourcesController', ['$scope', '$log', '$location', '$localStorage', 'API', 'authService', 'commonService', function($scope, $log, $location, $localStorage, API, authService, commonService) {
            var vm = this;

			vm.lookupCertIds = lookupCertIds;
			vm.download = download;
			vm.lookupProductsFormatInvalidIds = [];
			vm.lookupProductsCertIdNotFound = [];
			vm.viewProduct = viewProduct;

            activate();

			// Restore lookup IDs and results
			vm.certIds = $localStorage.lookupCertIds;
			vm.lookupProducts = $localStorage.lookupProducts;
			vm.lookupProductsFormatInvalidIds = $localStorage.lookupProductsFormatInvalidIds;
			vm.lookupProductsCertIdNotFound = $localStorage.lookupProductsCertIdNotFound;

			if ($localStorage.lookupCertIds && !$localStorage.lookupProducts) {
				lookupCertIds();
			}

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.API = API;
                vm.API_KEY = authService.getApiKey();
                vm.downloadOption= vm.API + '/download?api_key=' + vm.API_KEY;
                if (vm.API === '/rest') {
                    vm.swaggerUrl = $location.absUrl().split('#')[0] + 'rest/api-docs';
                } else {
                    vm.swaggerUrl = vm.API + '/api-docs';
                }
            }

			function convertArrayOfObjectsToCSV(args) {
				var result, ctr, keys, columnDelimiter, lineDelimiter, data;

				data = args.data || null;
				if (data === null || !data.length) {
					return null;
				}

				columnDelimiter = args.columnDelimiter || ',';
				lineDelimiter = args.lineDelimiter || '\n';

				// Collect columns
				keys = Object.keys(data[0]);
				keys = keys.filter(function(item) { return (item !== "id" && item !== "$$hashKey") });

				result = "";
				result = "CMS_EHR_CERTIFICATION_ID,CMS_EHR_CERTIFICATION_ID_EDITION,PRODUCT_NAME,PRODUCT_VERSION,DEVELOPER,CHPL_PRODUCT_NUMBER,PRODUCT_CERTIFICATION_EDITION,CLASSIFICATION_TYPE,PRACTICE_TYPE";
				result += lineDelimiter;

				data.forEach(function(item) {
					result += "\"" + (item["certificationId"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["certificationIdEdition"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["name"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["version"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["vendor"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["chplProductNumber"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["year"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["classification"] || "") + "\"" + columnDelimiter;
					result += "\"" + (item["practiceType"] || "") + "\"";
					result += lineDelimiter;
				});

				return result;
			}

			function download(args) {
				var filename = "lookupResults" + new Date().getTime() + ".csv";
				var csv = convertArrayOfObjectsToCSV({
					data: vm.lookupProducts
				});

				if (csv == null) return;

				if (msieversion()) {
					navigator.msSaveBlob(new Blob([csv],{type: "text/csv;charset=utf-8;"}), filename);
				} else {
					if (!csv.match(/^data:text\/csv/i)) {
						csv = 'data:text/csv;charset=utf-8,' + csv;
					}
					var link = document.createElement('a');
					link.setAttribute('href', encodeURI(csv));
					link.setAttribute('download', filename);
					link.click();
				}
			}

			function msieversion() {
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");
				// If Internet Explorer, return true
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
					return true;
				} else { // If another browser,
					return false;
				}
				return false;
			}

			function lookupCertIds () {
				vm.lookupProducts = null;
				vm.lookupProductsFormatInvalidIds = [];
				vm.lookupProductsCertIdNotFound = [];

				if ((vm.lookup !== "undefined") && (vm.certIds !== "undefined")) {
					vm.certIds = vm.certIds.replace(/[;,\s]+/g, " ");
					vm.certIds = vm.certIds.trim().toUpperCase();

					// Check format of input
					if ("" === vm.certIds.trim()) {
						clearLookup();
					} else {

						// Split IDs
						var idArray = vm.certIds.split(/ /);
						vm.lookupProducts = null;

						$localStorage.lookupCertIds = vm.certIds;
						
						var preventDuplicationIds = {};
						
						// Call LookupAPI
						idArray.forEach(function (id) {

							// Check if we've already checked this ID in case the user entered duplicates
							if (typeof preventDuplicationIds[id] === "undefined") {
								preventDuplicationIds[id] = true;
						
								// Check if ID format is valid
								if (!id.match(/^[0-9A-Z]{15}$/i)) {
									// Invalid ID format
									vm.lookupProductsFormatInvalidIds.push(id);
								} else {
									// Valid ID format
									commonService.lookupCertificationId(id)
										.then(function (data) {

											if (vm.lookupProducts === null)
												vm.lookupProducts = [];

											// If the ID was found, then I have data...
											if (data.products.length > 0) {
												data.products.forEach(function (product) {
													product.certificationId = data.ehrCertificationId;
													product.certificationIdEdition = data.year;
													vm.lookupProducts.push(product);
												});
											} else {
												// ...otherwise, if the ID was not found, tell the user.
												vm.lookupProductsCertIdNotFound.push(id);
											}
											
											$localStorage.lookupProducts = vm.lookupProducts;
											$localStorage.lookupProductsFormatInvalidIds = vm.lookupProductsFormatInvalidIds;
											$localStorage.lookupProductsCertIdNotFound = vm.lookupProductsCertIdNotFound;
											
										}, function (error) {
											console.debug("Error: " + error);
											clearLookupResults();
										});
								}
							}
						});
					}
				}
			}
			
			function clearLookup() {
				delete $localStorage.lookupCertIds;
				vm.certIds = null;
				clearLookupResults();
			}

			function clearLookupResults() {
				delete $localStorage.lookupProducts;
				delete $localStorage.lookupProductsFormatInvalidIds
				delete $localStorage.lookupProductsCertIdNotFound;
				vm.lookupProducts = null;
			}

            function viewProduct (cp) {
                $location.url('/product/' + cp.id);
            }
        }]);
})();
