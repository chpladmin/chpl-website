(function () {
    'use strict';

    angular.module('chpl.cms_lookup')
        .controller('CmsLookupController', CmsLookupController);

    /** @ngInject */
    function CmsLookupController ($localStorage, $log, networkService, utilService) {
        var vm = this;

        vm.getCsv = getCsv;
        vm.lookupCertIds = lookupCertIds;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.lookupProductsFormatInvalidIds = [];
            vm.lookupProductsCertIdNotFound = [];

            // Restore lookup IDs and results
            vm.certIds = $localStorage.lookupCertIds;
            vm.lookupProducts = $localStorage.lookupProducts;
            vm.lookupProductsFormatInvalidIds = $localStorage.lookupProductsFormatInvalidIds;
            vm.lookupProductsCertIdNotFound = $localStorage.lookupProductsCertIdNotFound;
            vm.csvData = $localStorage.lookupProductsCsv;

            if ($localStorage.lookupCertIds && !$localStorage.lookupProducts) {
                lookupCertIds();
            }
        }

        function getCsv () {
            utilService.makeCsv(vm.csvData);
        }

        function lookupCertIds () {
            vm.lookupProducts = null;
            vm.lookupProductsFormatInvalidIds = [];
            vm.lookupProductsCertIdNotFound = [];

            if (vm.certIds && vm.certIds.length > 0) {
                vm.certIds = vm.certIds.replace(/[;,\s]+/g, ' ');
                vm.certIds = vm.certIds.trim().toUpperCase();

                // Check format of input
                if (vm.certIds.trim() === '') {
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
                        if (typeof preventDuplicationIds[id] === 'undefined') {
                            preventDuplicationIds[id] = true;

                            // Check if ID format is valid
                            if (!id.match(/^[0-9A-Z]{15}$/i)) {
                                // Invalid ID format
                                vm.lookupProductsFormatInvalidIds.push(id);
                            } else {
                                // Valid ID format
                                networkService.lookupCertificationId(id)
                                    .then(function (data) {

                                        if (vm.lookupProducts === null) {
                                            vm.lookupProducts = [];
                                        }

                                        // If the ID was found, then I have data...
                                        if (data.products.length > 0) {
                                            data.products.forEach(function (product) {
                                                product.certificationId = data.ehrCertificationId;
                                                product.certificationIdEdition = data.year;
                                                if (!product.classification) {
                                                    product.classification = 'N/A';
                                                }
                                                if (!product.practiceType) {
                                                    product.practiceType = 'N/A';
                                                }
                                                vm.lookupProducts.push(product);
                                            });
                                            buildCsv();
                                        } else {
                                            // ...otherwise, if the ID was not found, tell the user.
                                            vm.lookupProductsCertIdNotFound.push(id);
                                        }

                                        $localStorage.lookupProducts = vm.lookupProducts;
                                        $localStorage.lookupProductsFormatInvalidIds = vm.lookupProductsFormatInvalidIds;
                                        $localStorage.lookupProductsCertIdNotFound = vm.lookupProductsCertIdNotFound;

                                    }, function (error) {
                                        $log.debug('Error: ' + error);
                                        clearLookupResults();
                                    });
                            }
                        }
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////

        function buildCsv () {
            var cp, i;
            vm.csvData = {
                name: 'CMS_ID',
                values: [
                    ['CMS EHR Certification ID', 'CMS EHR Certification ID Edition', 'Product Name', 'Version', 'Developer', 'CHPL Product Number', 'Product Certification Edition', 'Classification Type', 'Practice Type'],
                ],
            };
            for (i = 0; i < vm.lookupProducts.length; i++) {
                cp = vm.lookupProducts[i];
                if (vm.csvData.name.indexOf(cp.certificationId) === -1) {
                    vm.csvData.name += '.' + cp.certificationId;
                }
                vm.csvData.values.push([
                    cp.certificationId,
                    cp.certificationIdEdition,
                    cp.name,
                    cp.version,
                    cp.vendor,
                    cp.chplProductNumber,
                    cp.year + (cp.curesUpdate ? ' Cures Update' : ''),
                    cp.classification,
                    cp.practiceType,
                ]);
            }
            vm.csvData.name += '.csv';
            $localStorage.lookupProductsCsv = vm.csvData;
        }

        function clearLookup () {
            delete $localStorage.lookupCertIds;
            vm.certIds = null;
            clearLookupResults();
        }

        function clearLookupResults () {
            delete $localStorage.lookupProducts;
            delete $localStorage.lookupProductsFormatInvalidIds
            delete $localStorage.lookupProductsCertIdNotFound;
            delete $localStorage.lookupProductsCsv;
            vm.lookupProducts = null;
            vm.csvData = null;
        }
    }
})();
