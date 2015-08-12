var apis = {};
apis.entities = {};
apis.entities.address = {
    line1:'string',
    line2:'string',
    city:'string',
    region:'string',
    country:'string'};

apis.entities.user = {
    userId:'long',
    subjectName:'string',
    firstName:'string',
    lastName:'string',
    email:'string',
    phoneNumber:'string',
    title:'string',
    accountLocked:'boolean',
    accountEnabled:'boolean',
    userRole:['role1', 'role2?'],
    userACBs:['acb1', 'acb2?]']
};
apis.entities.acb = {
    acbId:'long',
    name:'string',
    website:'string',
    address: apis.entities.address
};
apis.entities.vendor = {
    vendorId:'long',
    name:'string',
    address:apis.entities.address,
    lastModifiedDate:'string'
};
apis.entities.product = {
    productId:'long',
    name:'string',
    details:'string (Whatever details can be modified for the product need to be here)',
    lastModifiedDate:'string'
};
apis.entities.version = {
    versionId:'long',
    version:'string',
    details:'string (Whatever details can be modified (if any) for the version need to be here)',
    lastModifiedDate:'string'
};
apis.entities.success = {
    response: 200
};


apis.endpoints = [
    {
        name: 'List Users',
        description: 'List all CHPL users',
        request: '/list_users',
        requestType: 'GET',
        parameters: null,
        response: [apis.entities.user]
    },{

        name: 'List ACBs',
        description: 'List all registered ACBs',
        request: '/list_acbs',
        requestType: 'GET',
        parameters: null,
        response: [apis.entities.acb]
    },{

        name: 'List users at ACB',
        description: 'List all ACB Admin or Staff with access to the parameterized ACB',
        request: '/list_users_at_acb',
        requestType: 'GET',
        parameters: 'acbId',
        response: [apis.entities.user]
    },{
        name: 'Create user',
        description: 'Create a user directly',
        note: 'The request json object will not have the userId, but will have a password. For development purposes only. Should there be a separate "create user" api call for creating a user at a particular ACB?',
        request: '/create_user',
        requestType: 'POST',
        jsonParameter: [apis.entities.user],
        response: apis.entities.success
    },{
        name: 'Invite user',
        description: 'Invite a user to register their account',
        note: 'Does the request need to have the ROLE and/or ACBs that will be associated with the user? Should there be a separate "invite user" api call to use when a user is being invited to manage an ACB?',
        request: '/invite_user',
        requestType: 'GET',
        parameters: ['example@example.com', ['ROLE'], ['acbId']],
        response: apis.entities.success
    },{
        name: 'Modify user',
        description: 'Modify a user',
        request: '/modify_user',
        requestType: 'POST',
        jsonParameter: [apis.entities.user],
        response: apis.entities.success
    },{
        name: 'Delete user',
        description: 'Disable a user\'s access to CHPL entirely',
        request: '/delete_user',
        requestType: 'GET',
        parameters: 'userId',
        response: apis.entities.success
    },{
        name: 'Delete user from ACB',
        description: 'Disable a user\'s ability to manage a particular ACB, without turning off whatever other access they have',
        request: '/delete_user_from_acb',
        requestType: 'GET',
        parameters: ['userId', 'acbId'],
        response: apis.entities.success
    },{
        name: 'Create ACB',
        description: 'Create an ACB',
        comment: 'Will not have acbId in JSON parameter',
        request: '/create_acb',
        requestType: 'POST',
        jsonParameter: apis.entities.acb,
        response: apis.entities.success
    }
];
