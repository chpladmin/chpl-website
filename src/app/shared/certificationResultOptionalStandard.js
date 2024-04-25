(() => {
  angular.module('chpl.shared')
    .factory('CertificationResultOptionalStandard', () => {
      const CertificationResultOptionalStandard = (optionalStandard) => ({
        optionalStandard,
      });

      // Return a reference to the function
      return CertificationResultOptionalStandard;
    });
})();
