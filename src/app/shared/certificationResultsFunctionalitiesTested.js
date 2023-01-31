(function () {
  'use strict';

  angular.module('chpl.shared')
    .factory('CertificationResultFunctionalitiesTested', function () {
      var CertificationResultFunctionalitiesTested = function (functionalitiesTested) {
        return {
          'description': functionalitiesTested.description,
          'name': functionalitiesTested.name,
          'functionalityTestedId': functionalitiesTested.id,
        };
      };

      // Return a reference to the function
      return CertificationResultFunctionalitiesTested;
    });
})();
