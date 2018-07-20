(function () {
    'use strict';

    angular.module('chpl.shared')
        .factory('CertificationResultTestStandard', function () {
            var CertificationResultTestStandard = function (testStandard) {
                return {
                    'description': testStandard.description,
                    'testStandardName': testStandard.name,
                    'testStandardId': testStandard.id,
                }
            };

            // Return a reference to the function
            return CertificationResultTestStandard;
        });
})();
