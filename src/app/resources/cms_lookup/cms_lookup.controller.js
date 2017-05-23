(function () {
    'use strict';

    angular.module('chpl.cms_lookup')
        .controller('CmsLookupController', CmsLookupController);

    /** @ngInject */
    function CmsLookupController ($log, $localStorage, commonService) {
        var vm = this;

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

            vm.filename = 'CMS_IDs_' + new Date().getTime() + '.csv';
            if ($localStorage.lookupCertIds && !$localStorage.lookupProducts) {
                lookupCertIds();
            }
        }

        function lookupCertIds () {
            vm.lookupProducts = null;
            vm.lookupProductsFormatInvalidIds = [];
            vm.lookupProductsCertIdNotFound = [];

            if (vm.certIds && vm.certIds.length > 0) {
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
                                        } else {
                                            // ...otherwise, if the ID was not found, tell the user.
                                            vm.lookupProductsCertIdNotFound.push(id);
                                        }

                                        $localStorage.lookupProducts = vm.lookupProducts;
                                        $localStorage.lookupProductsFormatInvalidIds = vm.lookupProductsFormatInvalidIds;
                                        $localStorage.lookupProductsCertIdNotFound = vm.lookupProductsCertIdNotFound;

                                    }, function (error) {
                                        $log.debug("Error: " + error);
                                        clearLookupResults();
                                    });
                            }
                        }
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////

        function clearLookup () {
            delete $localStorage.lookupCertIds;
            vm.certIds = null;
            clearLookupResults();
        }

        function clearLookupResults () {
            delete $localStorage.lookupProducts;
            delete $localStorage.lookupProductsFormatInvalidIds
            delete $localStorage.lookupProductsCertIdNotFound;
            vm.lookupProducts = null;
        }
    }
})();
