/* eslint-disable quotes, key-spacing */
let activity = [
    {"id":47455,"description":"Updated acb CCHIT","originalData":{"id":2,"acbCode":"03","name":"CCHIT","website":null,"address":null,"retired":false,"retirementDate":null},"newData":{"id":2,"acbCode":"03","name":"CCHIT","website":"http://www.example.com","address":{"id":536,"streetLineOne":"Address","streetLineTwo":null,"city":"City","state":"State","zipcode":"zip","country":"usa","creationDate":1556206460937,"deleted":false,"lastModifiedDate":1556206460937,"lastModifiedUser":42},"retired":false,"retirementDate":null},"activityDate":1556206461492,"activityObjectId":2,"concept":"CERTIFICATION_BODY","responsibleUser":{"userId":42,"subjectName":"andlar","fullName":"Andrew Larned","friendlyName":"Andrew","email":"alarned@ainq.com","phoneNumber":"301-560-6999","title":null,"accountLocked":false,"accountEnabled":true,"credentialsExpired":false,"passwordResetRequired":false,"hash":null}},
    {"id":47456,"description":"Updated acb ICSA Labs","originalData":{"id":6,"acbCode":"07","name":"ICSA Labs","website":"https://www.icsalabs.com","address":{"id":7,"streetLineOne":"1000 Bent Creek Blvd.","streetLineTwo":"Suite 200","city":"Mechanicsburg","state":"PA","zipcode":"17050","country":"USA","creationDate":1460500069431,"deleted":false,"lastModifiedDate":1460500069431,"lastModifiedUser":10},"retired":false,"retirementDate":null},"newData":{"id":6,"acbCode":"07","name":"ICSA Labs","website":"https://www.icsalabs.com","address":{"id":7,"streetLineOne":"1000 Bent Creek Blvd.","streetLineTwo":"Suite 200b","city":"Mechanicsburg","state":"PA","zipcode":"17050","country":"USA","creationDate":1460500069431,"deleted":false,"lastModifiedDate":1460500069431,"lastModifiedUser":10},"retired":false,"retirementDate":null},"activityDate":1556206495740,"activityObjectId":6,"concept":"CERTIFICATION_BODY","responsibleUser":{"userId":42,"subjectName":"andlar","fullName":"Andrew Larned","friendlyName":"Andrew","email":"alarned@ainq.com","phoneNumber":"301-560-6999","title":null,"accountLocked":false,"accountEnabled":true,"credentialsExpired":false,"passwordResetRequired":false,"hash":null}},
];

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

export { getActivity, getMetadata };
