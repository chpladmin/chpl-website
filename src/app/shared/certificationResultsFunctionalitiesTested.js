(function () {
  'use strict';

  angular.module('chpl.shared')
    .factory('CertificationResultFunctionalitiesTested', function () {
      var CertificationResultFunctionalitiesTested = function (functionalitiesTested) {
        return {
          functionalityTested: {
            'value': functionalitiesTested.value,
            'regulatoryTextCitation': functionalitiesTested.regulatoryTextCitation,
            'id': functionalitiesTested.id,
          },
        };
      };

      // Return a reference to the function
      return CertificationResultFunctionalitiesTested;
    });
})();
