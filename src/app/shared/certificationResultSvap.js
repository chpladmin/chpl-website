(function () {
    'use strict';

    angular.module('chpl.shared')
        .factory('CertificationResultSvap', function () {
            var CertificationResultSvap = function (svap) {
                return {
                    'svapId': svap.svapId,
                    'regulatoryTextCitation': svap.regulatoryTextCitation,
                    'approvedStandardVersion': svap.approvedStandardVersion,
                };
            };

            // Return a reference to the function
            return CertificationResultSvap;
        });
})();
