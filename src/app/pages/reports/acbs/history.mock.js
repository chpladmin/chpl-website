/* eslint-disable quotes, key-spacing */
(function () {
    'use strict';

    angular.module('chpl.listing')
        .value('metadata', getMetadata)
        .value('activity', getActivity);

    let activity = [];

    let metadata = {
        acb: [
            {"id":47455,"concept":"CERTIFICATION_BODY","categories":["CERTIFICATION_BODY"],"date":1556206461492,"objectId":2,"responsibleUser":{"userId":42,"subjectName":"andlar","fullName":"Andrew Larned","friendlyName":"Andrew","email":"alarned@ainq.com","phoneNumber":"301-560-6999","title":null,"accountLocked":false,"accountEnabled":true,"credentialsExpired":false,"passwordResetRequired":false,"hash":null},"acbId":2,"acbName":"CCHIT"},
            {"id":47456,"concept":"CERTIFICATION_BODY","categories":["CERTIFICATION_BODY"],"date":1556206495740,"objectId":6,"responsibleUser":{"userId":42,"subjectName":"andlar","fullName":"Andrew Larned","friendlyName":"Andrew","email":"alarned@ainq.com","phoneNumber":"301-560-6999","title":null,"accountLocked":false,"accountEnabled":true,"credentialsExpired":false,"passwordResetRequired":false,"hash":null},"acbId":6,"acbName":"ICSA Labs"}
        ],
    };

    function getActivity (id) {
        return activity.filter(a => a.id === id)[0];
    }

    function getMetadata (type) {
        return metadata[type];
    }
})();
