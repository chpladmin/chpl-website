(function () {
    'use strict';

    angular.module('chpl.shared')
        .factory('CertificationResultTestTool', function () {
            var CertificationResultTestTool = function (testTool, version) {
                return {
                    'retired': testTool.retired,
                    'testToolId': testTool.id,
                    'testToolName': testTool.name,
                    'testToolVersion': version,
                }
            };

            // Return a reference to the function
            return CertificationResultTestTool;
        });
})();
