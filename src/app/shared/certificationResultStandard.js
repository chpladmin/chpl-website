(() => {
  angular.module('chpl.shared')
    .factory('CertificationResultStandard', () => {
      const CertificationResultStandard = (standard) => ({
        standardId: standard.id,
        citation: standard.citation,
        description: standard.description,
      });

      // Return a reference to the function
      return CertificationResultStandard;
    });
})();
