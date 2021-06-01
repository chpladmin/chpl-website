(function () {
  'use strict';

  angular.module('chpl.shared')
    .factory('CertificationResultOptionalStandard', function () {
      var CertificationResultOptionalStandard = function (optionalStandard) {
        return {
          id: optionalStandard.id,
          optionalStandard: optionalStandard.optionalStandard,
        };
      };

      // Return a reference to the function
      return CertificationResultOptionalStandard;
    });
})();
