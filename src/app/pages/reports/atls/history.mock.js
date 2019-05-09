/* eslint-disable quotes, key-spacing */
let activity = [
    {"id":47459,"description":"Updated testing lab National Committee for Quality Assurance (NCQA)","originalData":{"id":7,"testingLabCode":"10","address":{"id":383,"streetLineOne":"1100 13th Street NW","streetLineTwo":"3rd Floor","city":"Washington","state":"DC","zipcode":"20005","country":"USA","creationDate":1519439145103,"deleted":false,"lastModifiedDate":1519439145103,"lastModifiedUser":-2},"name":"National Committee for Quality Assurance (NCQA)","website":"http://www.ncqa.org/onchealthittesting","accredidationNumber":null,"retired":false,"retirementDate":null},"newData":{"id":7,"testingLabCode":"10","address":{"id":383,"streetLineOne":"1100 13th Street NW","streetLineTwo":"3rd Floor, room 2","city":"Washington","state":"DC","zipcode":"20005","country":"USA","creationDate":1519439145103,"deleted":false,"lastModifiedDate":1519439145103,"lastModifiedUser":-2},"name":"National Committee for Quality Assurance (NCQA)","website":"http://www.ncqa.org/onchealthittesting","accredidationNumber":null,"retired":false,"retirementDate":null},"activityDate":1556283355151,"activityObjectId":7,"concept":"TESTING_LAB","responsibleUser":{"userId":42,"subjectName":"andlar","fullName":"Andrew Larned","friendlyName":"Andrew","email":"alarned@ainq.com","phoneNumber":"301-560-6999","title":null,"accountLocked":false,"accountEnabled":true,"credentialsExpired":false,"passwordResetRequired":false,"hash":null}},
];

let metadata = {
    atl: [
        {"id":47459,"concept":"TESTING_LAB","categories":["TESTING_LAB"],"date":1556283355151,"objectId":7,"responsibleUser":{"userId":42,"subjectName":"andlar","fullName":"Andrew Larned","friendlyName":"Andrew","email":"alarned@ainq.com","phoneNumber":"301-560-6999","title":null,"accountLocked":false,"accountEnabled":true,"credentialsExpired":false,"passwordResetRequired":false,"hash":null},"atlId":7,"atlName":"National Committee for Quality Assurance (NCQA)"},
    ],
};

function getActivity (id) {
    return activity.filter(a => a.id === id)[0];
}

function getMetadata (type) {
    return metadata[type];
}

export { getActivity, getMetadata };
