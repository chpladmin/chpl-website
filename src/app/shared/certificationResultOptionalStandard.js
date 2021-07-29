(() => {
  angular.module('chpl.shared')
    .factory('CertificationResultOptionalStandard', () => {
      const CertificationResultOptionalStandard = (optionalStandard) => ({
        optionalStandardId: optionalStandard.id,
        citation: optionalStandard.citation,
        description: optionalStandard.description,
      });

      // Return a reference to the function
      return CertificationResultOptionalStandard;
    });
})();
