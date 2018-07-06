(function () {
    'use strict';

    angular.module('chpl')
        .factory('CertificationResultTestData', function () {
            var CertificationResultTestData = function (testData, version, alteration) {
                return {
                    'testData': testData,
                    'version': version,
                    'alteration': alteration,
                }
            };

            // Return a reference to the function
            return CertificationResultTestData;
        });
})();
