(() => {
  angular.module('chpl.shared')
    .factory('CertificationResultStandard', () => {
      const CertificationResultStandard = (standard) => ({
        standardId: standard.id,
        citation: standard.value,
        description: standard.regulatoryTextCitation,
      });

      // Return a reference to the function
      return CertificationResultStandard;
    });
})();
