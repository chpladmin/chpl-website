(function () {
    'use strict';

    angular.module('chpl')
        .factory('CertificationResultTestFunctionality', function () {
            var CertificationResultTestFunctionality = function (testFunctionality) {
                return {
                    'description': testFunctionality.description,
                    'name': testFunctionality.name,
                    'testFunctionalityId': testFunctionality.id,
                    'year': testFunctionality.year,
                }
            };

            // Return a reference to the function
            return CertificationResultTestFunctionality;
        });
})();
