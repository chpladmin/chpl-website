(function () {
  'use strict';

  angular.module('chpl.shared')
    .factory('CertificationResultConformanceMethod', function () {
      var CertificationResultConformanceMethod = function (conformanceMethod, version) {
        return {
          'conformanceMethod': conformanceMethod,
          'conformanceMethodVersion': version,
        };
      };

      // Return a reference to the function
      return CertificationResultConformanceMethod;
    });
})();
