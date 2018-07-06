'use strict';

angular.module('chpl')
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
