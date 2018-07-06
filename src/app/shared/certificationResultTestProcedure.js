'use strict';

angular.module('chpl')
    .factory('CertificationResultTestProcedure', function () {
        var CertificationResultTestProcedure = function (testProcedure, version) {
            return {
                'testProcedure': testProcedure,
                'testProcedureVersion': version,
            }
        };

        // Return a reference to the function
        return CertificationResultTestProcedure;
    });
