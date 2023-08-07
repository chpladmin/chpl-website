(function () {
  'use strict';

  angular.module('chpl.shared')
    .factory('CertificationResultTestTool', function () {
      var CertificationResultTestTool = function (testTool, version) {
        return {
          testTool,
          version: version,
        };
      };

      // Return a reference to the function
      return CertificationResultTestTool;
    });
})();
