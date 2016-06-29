;(function () {
    'use strict';

    angular.module('app.resources')
        .controller('ResourcesController', ['$scope', '$log', '$location', 'API', 'authService', 'commonService', function($scope, $log, $location, API, authService, commonService) {
            var vm = this;

			vm.lookupCertIds = lookupCertIds;
			vm.download = download;
			vm.lookupProductsFormatInvalid = false;
			vm.viewProduct = viewProduct;

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
				if (data === null || !data.length) {
					return null;
				}

				columnDelimiter = args.columnDelimiter || ',';
				lineDelimiter = args.lineDelimiter || '\n';

				// Collect columns
				keys = Object.keys(data[0]);
				keys = keys.filter(function(item) { return (item !== "id" && item !== "$$hashKey") });

				result = "";
				result = "CMS_EHR_CERTIFICATION_ID,CMS_EHR_CERTIFICATION_ID_YEAR,PRODUCT_NAME,PRODUCT_VERSION,DEVELOPER,CHPL_PRODUCT_NUMBER,PRODUCT_CERTIFICATION_EDITION,CLASSIFICATION_TYPE,PRACTICE_TYPE";
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
				vm.lookupProductsFormatInvalid = false;

				if ((vm.lookup !== "undefined") && (vm.lookup.certIds !== "undefined")) {
					vm.lookup.certIds = vm.lookup.certIds.replace(/[;,\s]+/g, " ");
					vm.lookup.certIds = vm.lookup.certIds.trim().toUpperCase();

					// Check format of input
					if (null !== vm.lookup.certIds.match(/^([0-9A-Z]{15}([ ][0-9A-Z]{15})*)$/i)) {

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
						vm.lookupProductsFormatInvalid = true;
						vm.lookupProducts = null;
					}
				}
			}

            function viewProduct (cp) {
                $location.url('/product/' + cp.id);
            }
        }]);
})();
