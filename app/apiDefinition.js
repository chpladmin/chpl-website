'use strict';

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
    title:'string'
};
apis.entities.createUserAndRoles = {
	userId:'long',
	subjectName:'string',
	firstName:'string',
	lastName:'string',
	email:'string',
	phoneNumber:'string',
	title:'string',
	userRole:['role1', 'role2?']
};
apis.entities.createdUser = {
	userId:'long',
	subjectName:'string',
	firstName:'string',
	lastName:'string',
	email:'string',
	phoneNumber:'string',
	title:'string',
	accountLocked:'boolean',
	accountEnabled:'boolean'
};
apis.entities.userWithPermissions = {
	users: [
	    {
	        user: {
				userId:'long',
				subjectName:'string',
				firstName:'string',
				lastName:'string',
				email:'string',
				phoneNumber:'string',
				title:'string',
				accountLocked:'boolean',
				accountEnabled:'boolean'
	        },
	        permissions: ['ADMIN', 'READ']
	    }
	]
};
apis.entities.userAndRoles = {
	userId:'long',
	subjectName:'string',
	firstName:'string',
	lastName:'string',
	email:'string',
	phoneNumber:'string',
	title:'string',
	accountLocked:'boolean',
	accountEnabled:'boolean',
	userRole:['role1', 'role2?']
};
apis.entities.usersAtAcb = {
	users: [
	    {
	        user: {
				userId:'long',
				subjectName:'string',
				firstName:'string',
				lastName:'string',
				email:'string',
				phoneNumber:'string',
				title:'string',
				accountLocked:'boolean',
				accountEnabled:'boolean'
	        },
	        certificationBodyId: 'long',
	        permissions: ['ADMIN', 'READ']
	    }
	]
};
apis.entities.grantRole = {
	subjectName: 'string',
	role: 'string'
};
apis.entities.grantAcb = {
	acbId: 'long',
	userId: 'long',
	authority: 'string'
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
    website: 'string',
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
apis.entities.cps = {
    cpId:'long',
    chplNum:'string',
    certDate:'string',
    lastModifiedDate:'string'
};
apis.entities.success = {
    response: 200
};
apis.entities.cpActivity = {
    product:'string',
    vendor:'string',
    version:'string',
    certBody:'string',
    edition:'string',
    activityDate:'string',
    activity:'string'
};
apis.entities.vendorActivity = {
    vendor:'string',
    activityDate:'string',
    activity:'string'
};
apis.entities.productActivity = {
    product:'string',
    vendor:'string',
    activityDate:'string',
    activity:'string'
};
apis.entities.acbActivity = {
    acb:'string',
    activityDate:'string',
    activity:'string'
};
apis.entities.searchResults = {
    recordCount:'long',
    pageSize:'int',
    pageNumber:'int',
    results:[{
        id:'long',
        testingLabId: 'long',
        chplProductNumber: 'string',
        reportFileLocation: 'string',
        qualityManagementSystemAtt: 'string',
        acbCertificationId: 'string',
        classificationType: {
            name: 'string',
            id: 'long'
        },
        otherAcb: 'long',
        certificationStatusId: 'long',
        vendor: {
            name: 'string',
            id: 'long'
        },
        product: {
            versionId: 'long',
            name: 'string',
            id: 'long',
            version: 'version'
        },
        certificationEdition: {
            name: 'string',
            id: 'long'
        },
        practiceType: {
            name: 'string',
            id: 'long'
        },
        certifyingBody: {
            name: 'string',
            id: 'long'
        },
        certificationDate: 'string in format yyyy-mm-dd hh:mm:ss.S',
        countCerts: 'long',
        countCqms: 'long'
    }]
};
apis.entities.searchRequest = {
    vendor: 'string (optional)',
    product: 'string (optional)',
    version: 'string (optional)',
    certificationEdition: 'string (optional)',
    productClassification: 'string (optional)',
    certificationCriteria: ['string (optional)'],
    cqms: ['string (optional)'],
    practiceType: 'string (optional)',
    orderBy: 'string (optional)'
};
apis.entities.certifiedProduct = {
    id:'long',
    testingLabId:'long',
    chplProductNumber:'string',
    reportFileLocation:'string',
    qualityManagementSystemAtt:'string',
    acbCertificationId:'string',
    classificationType:{name:'string',
                        id:'long'},
    otherAcb:'string',
    certificationStatusId:'long',
    vendor:{'name':'string',
            id:'long'},
    product:{'versionId':'long',
             name:'string',
             id:'long',
             version:'string'},
    certificationEdition:{'name':'string',
                          id:'long'},
    practiceType:{'name':'string',
                  id:'long'},
    certifyingBody:{'name':'string',
                    id:'long'},
    certificationDate:'string (yyyy-mm-dd HH:mm:ss.S)',
    countCerts:'long',
    countCqms:'long',
    certificationResults:[{number:'string',
                           title:'string',
                           success:'boolean'},
                         ],
    cqmResults:[{number:'string',
                 cmsId:'string',
                 title:'string',
                 nqfNumber:'string',
                 success:'boolean',
                 version:'string'}
               ]
};

apis.endpoints = [
    {
        name: 'List Users',
        description: 'List all CHPL users',
        request: '/auth/list_users',
        id: 'list_users',
        requestType: 'GET',
        parameters: null,
        security: 'Admin',
        response: [apis.entities.userWithPermissions]
    },{
        name: 'List ACBs',
        description: 'List all registered ACBs',
        request: '/acb/list_acbs',
        id: 'list_acbs',
        requestType: 'GET',
        parameters: null,
        security: null,
        response: [apis.entities.acb]
    },{
        name: 'List Users at ACB',
        description: 'List all ACB Admin or Staff with access to the parameterized ACB',
        request: '/acb/list_users/ACB_ID',
        id: 'list_users_at_acb',
        requestType: 'GET',
        parameters: 'acbId',
        security: 'Admin or ACB Admin',
        response: [apis.entities.userWithPermissions]
    },{
        name: 'Create User',
        description: 'Create a user. Do not grant any special permissions.',
        note: 'The request json object will not have the userId, but will have a password.' +
        	'<ul>Optional fields: <li>title</li></ul>' +
        	'For development purposes only. Should there be a separate "create user" api call for creating a user at a particular ACB?',
        request: '/auth/create_user',
        id: 'create_user',
        requestType: 'POST',
        jsonParameter: apis.entities.user,
        security: 'Admin',
        response: apis.entities.createdUser
    },{
        name: 'Create User With Role(s)',
        description: 'Create a user and grant them role(s) in the CHPL system.',
        note: 'The request json object will not have the userId, but will have a password.' +
            '<br/>The roles specified may be ROLE_ADMIN, ROLE_ACB_STAFF, or ROLE_ACB_ADMIN' +
    	    '<ul>Optional fields: <li>title</li></ul>' +
    	    'For development purposes only. Should there be a separate "create user" api call for creating a user at a particular ACB?',
        request: '/auth/create_user_with_roles',
        id: 'create_user_with_roles',
        requestType: 'POST',
        jsonParameter: apis.entities.createUserAndRoles,
        security: 'Admin',
        response: apis.entities.createdUser
    },{
        name: 'Invite User',
        description: 'Invite a user to register their account',
        note: 'Does the request need to have the ROLE and/or ACBs that will be associated with the user? Should there be a separate "invite user" api call to use when a user is being invited to manage an ACB?',
        request: '/invite_user',
        id: 'invite_user',
        requestType: 'GET',
        parameters: ['example@example.com', ['ROLE'], ['acbId']],
        security: 'Admin',
        response: apis.entities.success
    },{
    	name: 'Grant Role to User',
        description: 'Add a role for the user. One of ROLE_ACB_STAFF, and ROLE_ACB_ADMIN',
        request: '/auth/grant_user_role',
        id: 'grant_user_role',
        requestType: 'POST',
        jsonParameter: apis.entities.grantRole,
        security: 'Admin',
        response: {"roleAdded": "true"}
    },{
    	name: 'Revoke Role from User',
        description: 'Remove a role for the user. One of ROLE_ACB_STAFF, and ROLE_ACB_ADMIN',
        request: '/auth/revoke_user_role',
        id: 'revoke_user_role',
        requestType: 'POST',
        jsonParameter: apis.entities.grantRole,
        security: 'Admin',
        response: {"roleRemoved": "true"}
    },{
        name: 'Modify User',
        description: 'Modify a user',
        request: '/auth/update_user',
        id: 'modify_user',
        requestType: 'POST',
        jsonParameter: apis.entities.createdUser,
        security: 'Admin or the user themselves',
        response: apis.entities.success
    },{
        name: 'Delete User',
        description: 'Disable a user\'s access to CHPL entirely',
        request: '/auth/delete_user/USER_ID',
        id: 'delete_user',
        requestType: 'POST',
        parameters: 'USER_ID: long',
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'Add User to ACB',
        description: 'Give a user a role at a particular ACB',
        note: "Authority is one of 'READ', 'DELETE', or 'ADMIN' and defines the capabilities that user has on that ACB.",
        request: '/acb/add_user',
        id: 'add_user_to_acb',
        parameters: 'acbId: long, userId: long, authority: string [READ, DELETE, ADMIN]',
        requestType: 'POST',
        jsonParameter: apis.entities.grantAcb,
        security: 'Admin or ACB Admin',
        response: apis.entities.success
    },{
        name: 'Delete User from ACB',
        description: 'Disable a user\'s ability to manage a particular ACB, without turning off whatever other access they have',
        note: "Authority is one of 'READ', 'DELETE', or 'ADMIN' and defines the capabilities that user has on that ACB. It is optional on this request. If provided, only that specific authority will be removed for that user and ACB. If not provided, all authorities on that ACB will be removed for that user.",
        request: '/acb/delete_user',
        id: 'delete_user_from_acb',
        requestType: 'POST',
        jsonParameter: apis.entities.grantAcb,
        security: 'Admin or ACB Admin',
        response: apis.entities.success
    },{
        name: 'Create ACB',
        description: 'Create an ACB',
        note: 'Will not have acbId in JSON request parameter',
        request: '/acb/create',
        id: 'create_acb',
        requestType: 'POST',
        jsonParameter: apis.entities.acb,
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'Update ACB',
        description: 'Modify an already existing ACB',
        request: '/acb/update',
        id: 'update_acb',
        requestType: 'POST',
        jsonParameter: apis.entities.acb,
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'Delete ACB',
        description: 'Delete an existing ACB',
        request: '/acb/delete/ACB_ID',
        id: 'delete_acb',
        requestType: 'POST',
        security: 'Admin or ACB Admin or ACB Delete',
        response: apis.entities.success
    },{
        name: 'List Certified Product Activity',
        description: 'Get a list of the certified product activity. If the logged in user is a CHPL admin, this will return all activity from all Certified Products. If the user is an ACB admin, this will return a filtered list of Certified Products; including only those the user has ACB admin rights over.',
        request: '/list_certified_product_activity',
        id: 'list_certified_product_activity',
        requestType: 'GET',
        parameters: null,
        security: 'Admin',
        response: [apis.entities.cpActivity]
    },{
        name: 'List Vendor Activity',
        description: 'Get a list of the vendor activity',
        request: '/list_vendor_activity',
        id: 'list_vendor_activity',
        requestType: 'GET',
        parameters: null,
        security: 'Admin',
        response: [apis.entities.vendorActivity]
    },{
        name: 'List Product Activity',
        description: 'Get a list of the product activity',
        request: '/list_product_activity',
        id: 'list_product_activity',
        requestType: 'GET',
        parameters: null,
        security: 'Admin',
        response: [apis.entities.productActivity]
    },{
        name: 'List ACB Activity',
        description: 'Get a list of the acb activity. If the logged in user is a CHPL admin, this will return all activity from all Certified Products. If the user is an ACB admin, this will return a filtered list of Certified Products; including only those the user has ACB admin rights over.',
        request: '/list_acb_activity',
        id: 'list_acb_activity',
        requestType: 'GET',
        parameters: null,
        security: 'Admin',
        response: [apis.entities.acbActivity]
    },{
        name: 'List Products by Vendor',
        description: 'Get a list of all of the products associated with the parameterized vendor',
        note: 'Same as current "/list_products" call, but filtered down to only the products owned by the passed in vendor. Could be done on the front end, but maybe faster/easier on the back?',
        request: '/product/list_products_by_vendor',
        id: 'list_products_by_vendor',
        requestType: 'GET',
        parameters: 'vendorId',
        security: null,
        response: [apis.entities.product]
    },{
        name: 'List Versions by Product',
        description: 'Get a list of all of the versions associated with the parameterized product',
        request: '/product/version/list_versions_by_product',
        id: 'list_versions_by_product',
        requestType: 'GET',
        parameters: 'productId',
        security: null,
        response: [apis.entities.version]
    },{
        name: 'List Certified Products by Version',
        description: 'Get a list of all of the Certified Products associated with the parameterized version (and, by implication, the relevant vendor & product). If the logged in user is a CHPL admin, this will return all relevant Certified Products. If the user is an ACB admin, this will return a filtered list of the relevant Certified Products; including only those that were certified by an ACB the user has ACB admin rights over.',
        note: 'Not sure what should be displayed here for the end user to choose the particular CP they\'re looking for. Maybe CHPL_Num? Maybe CertDate?',
        request: '/list_certified_products_by_version',
        id: 'list_certified_products_by_version',
        requestType: 'GET',
        parameters: 'versionId',
        security: 'Admin',
        response: [apis.entities.cps]
    },{
        name: 'List Vendors',
        description: 'List all vendors with relevant data',
        request: '/vendor/list_vendors',
        id: 'list_vendors',
        requestType: 'GET',
        parameters: null,
        security: null,
        response: [apis.entities.vendor]
    },{
        name: 'Get Vendor',
        description: 'Get a specific vendor, with relevant data',
        request: '/vendor/get_vendor',
        id: 'get_vendor',
        requestType: 'GET',
        parameters: 'vendorId',
        security: null,
        response: apis.entities.vendor
    },{
        name: 'Get Product',
        description: 'Get a specific product, with relevant data',
        request: '/product/get_product',
        id: 'get_product',
        requestType: 'GET',
        parameters: 'productId',
        security: null,
        response: apis.entities.product
    },{
        name: 'Get Version',
        description: 'Get a specific version, with relevant data',
        request: '/product/version/get_version',
        id: 'get_version',
        requestType: 'GET',
        parameters: 'versionId',
        security: null,
        response: apis.entities.version
    },{
        name: 'Update Vendor',
        description: 'Update one or more vendors with passed in data. If more than one vendorId is supplied, merge the vendors, assigning all products originally assigned to any of the vendors to the single resulting vendor',
        note: 'The Vendor object in the Request parameter may or may not have a vendorId or lastModifiedDate field',
        request: '/vendor/update_vendor',
        id: 'update_vendor',
        requestType: 'POST',
        jsonParameter: {'vendorIds': ['long'], 'vendor': apis.entities.vendor},
        security: 'Admin',
        response: apis.entities.vendor
    },{
        name: 'Update Product',
        description: 'Update one or more products with passed in data. If more than one productId is supplied, merge the products, assigning all versions originally assigned to any of the products to the single resulting product. If a newVendorId is supplied in the Request, the Product is changing ownership; merge the products (if necessary), and then reassign it to the new Vendor indicated',
        note: 'The Product object in the Request parameter will not have a productId or lastModifiedDate field',
        request: '/update_product',
        id: 'update_product',
        requestType: 'POST',
        jsonParameter: {'productIds': ['long'], product: apis.entities.product, newVendorId: 'long (optional)'},
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'Update Version',
        description: 'Update the version of a specific product',
        request: '/update_version',
        id: 'update_version',
        requestType: 'POST',
        jsonParameter: {"versionId" : 'long', "version": 'string'},
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'Update Certified Product',
        description: 'Update a certified product with the passed in data',
        note: 'This is the big one. Will want to pass in a certified product in same format as what is returned from the "/get_product?id=SOMETHING" existing call, and will want that certified product to be updated accordingly. Probably should not change Vendor/Product/Version relationships, but anything(?) else is fair game. Also, would be happy to split this into two calls: one for basic certified product info (classification, practice type, certifying acb, etc.), second for certification & cqm updates. Discussion warranted?',
        request: '/update_certified_product',
        id: 'update_certified_product',
        requestType: 'POST',
        jsonParameter: {cpId: 'long', other: 'All of the other parts of the certified product'},
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'List Certified Products being uploaded',
        description: 'Retrieve the Certified Products that are in the process of being uploaded into the CHPL database. If the user is a CHPL Admin, this will return all of those CPs. If the user is an ACB Admin, it will only return those that are being certified by an ACB to which that user has access',
        request: '/list_uploadingCps',
        id: 'list_uploadingCps',
        requestType: 'GET',
        parameters: null,
        security: 'Admin',
        response: [{cpId: 'long', vendor: apis.entities.vendor, product: apis.entities.product, version: apis.entities.version, certified_product: 'all the parts of a cp in the process of uploading', uploadDate: 'string'}]
    },{
        name: 'Confirm Certified Product being uploaded',
        description: 'Confirm a particular Certified Product is ready to be entered in the CHPL database permanently',
        request: '/confirm_uploadingCp',
        id: 'confirm_uploadingCp',
        requestType: 'GET',
        parameters: 'cpId',
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'Start Upload of Certified Products',
        description: 'Provides end point for reception of Certified Product upload file',
        note: 'Not too sure about the details for this one, but something like it will be necessary',
        request: '/uploadCps',
        id: 'uploadCps',
        requestType: 'POST',
        jsonParameter: {file: 'file'},
        security: 'Admin',
        response: apis.entities.success
    },{
        name: 'Simple Search',
        description: 'Provides an endpoint for performing a keyword search of Vendor and Product fields',
        request: '/simple_search',
        id: 'simple_search',
        requestType: 'GET',
        parameters: ['searchTerm', 'pageNum (optional)', 'pageSize (optional)', 'orderBy (optional)'],
        security: null,
        response: apis.entities.searchResults
    },{
        name: 'Advanced Search',
        description: 'Provides an endpoint for performing an advanced search, choosing specific fields to search on',
        request: '/advanced_search',
        id: 'advanced_search',
        requestType: 'POST',
        parameters: ['pageNum (optional)', 'pageSize (optional)'],
        jsonParameter: apis.entities.searchRequest,
        security: null,
        response: apis.entities.searchResults
    },{
        name: 'Get Certified Product',
        description: 'Return the certified product specified by the passed in parameter',
        request: '/certified_product/get_certified_product',
        id:'get_certified_product',
        requestType: 'GET',
        parameters: 'certifiedProductId',
        security: null,
        response: apis.entities.certifiedProduct
    }
];
