(function () {
  'use strict';

  angular.module('chpl.shared')
    .factory('CertificationResultOptionalStandard', function () {
      var CertificationResultOptionalStandard = function (optionalStandard) {
        return {
          optionalStandardId: optionalStandard.id,
          citation: optionalStandard.citation,
          description: optionalStandard.description,
        };
      };

      // Return a reference to the function
      return CertificationResultOptionalStandard;
    });
})();
