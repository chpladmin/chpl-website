'use strict';

var apis = {};
apis.entities = {};
apis.entities.address = {
    line1:'string',
    line2:'string',
    city:'string',
    state:'string',
    zipcode:'string',
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
	        roles: [],
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
	roles:['role1', 'role2?']
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
apis.entities.announcement = {
	id:'long',
	title:'string',
	text:'string',
	startDate:'string',
	endDate:'string',
	isPublic:'string'
};
apis.entities.vendor = {
    vendorId:'long',
    name:'string',
    website: 'string',
    address:apis.entities.address,
    lastModifiedDate:'long'
};
apis.entities.product = {
    productId:'long',
    name:'string',
    reportFileLocation:'string',
    lastModifiedDate:'long'
};
apis.entities.version = {
    versionId:'long',
    version:'string',
    lastModifiedDate:'string'
};
apis.entities.cps = {
    id: 'long',
    testingLabId: 'long',
    chplProductNumber: 'string',
    reportFileLocation: 'string',
    qualityManagementSystemAtt: 'string',
    acbCertificationId: 'long',
    classificationType: {},
    otherAcb: 'string',
    certificationStatusId: 'long',
    vendor: {},
    product: {},
    certificationEdition: {},
    practiceType: {},
    certifyingBody: {},
    certificationDate: null,
    certificationResults: [],
    cqmResults: [],
    lastModifiedDate: 'long'
};
apis.entities.success = {
    response: 200
};
apis.entities.activity = {
    activityDate:'millis since epoch',
    description:'string',
    originalData: apis.entities.cps,
    newData: apis.entities.cps
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
    searchTerm: 'string (optional)',
    vendor: 'string (optional)',
    product: 'string (optional)',
    version: 'string (optional)',
    certificationEdition: 'string (optional)',
    productClassification: 'string (optional)',
    certificationCriteria: ['string (optional)'],
    cqms: ['string (optional)'],
    practiceType: 'string (optional)',
    orderBy: 'string (optional)',
    sortDescending: 'boolean (optional)',
    pageNumber: 'long (optional)',
    pageSize: 'long (optional)',
    visibleOnCHPL: 'boolean (optional)'
};
apis.entities.cqm = {
    cmsId: 'long',
    cqmCriterionTypeId: 'long',
    cqmDomain: 'string',
    cqmVersion: 'string',
    cqmVersionId: 'long',
    criterionId: 'long',
    description: 'string',
    nqfNumber: 'string',
    number: 'string',
    title: 'string'
};
apis.entities.certifiedProduct = {
    acbCertificationId:'string',
    additionalSoftware: [{additionalSoftwareid: 'long', certifiedProductId: 'long', justification: 'string',name: 'string', version: 'string'}],
    applicableCqmCriteria: [apis.entities.cqm],
    certificationDate:'long',
    certificationEdition:{'name':'string', id:'long'},
    certificationEvents: [{city: 'string', eventDate: 'long', eventTypeDescription: 'string', eventTypeId: 'long', eventTypeName: 'string', id: 'long', lastModifiedDate: 'long', lastModifiedUser: 'long', state: 'string'}],
    certificationResults:[{number:'string', title:'string', success:'boolean'}],
    certificationStatus:{name:'string',id:'long'},
    certifyingBody:{'name':'string', id:'long'},
    chplProductNumber:'string',
    classificationType:{name:'string', id:'long'},
    countCerts:'long',
    countCqms:'long',
    cqmResults:[{number:'string', cmsId:'string', title:'string', nqfNumber:'string', success:'boolean', version:'string'}],
    id:'long',
    lastModifiedDate:'long',
    otherAcb:'string',
    practiceType:{'name':'string', id:'long'},
    product:{versionId:'long', name:'string', id:'long', version:'string'},
    qualityManagementSystemAtt:'string',
    reportFileLocation:'string',
    testingLabId:'long',
    vendor:{name:'string', id:'long'},
    visibleOnChpl:'boolean'
};

apis.endpoints = [
    {
    	category: 'Announcements',
    	description: 'List all announcements',
    	request: '/announcements/',
    	requestType: 'GET',
    	response: [apis.entities.announcements]
    },{
    	category: 'ACBs',
        description: 'List all registered ACBs, or optional ACB by given ID',
        request: '/acbs/(:id)',
        requestType: 'GET',
        response: [apis.entities.acb]
    },{
        category: 'ACBs',
        description: 'Delete an existing ACB',
        request: '/acbs/:id/delete',
        requestType: 'POST',
        security: 'Admin or ACB Admin or ACB Delete',
        response: apis.entities.success
    },{
        category: 'ACBs',
        description: 'Disable a user\'s ability to manage a particular ACB, without turning off whatever other access they have',
        note: "Authority is one of 'READ', 'DELETE', or 'ADMIN' and defines the capabilities that user has on that ACB. It is optional on this request. If provided, only that specific authority will be removed for that user and ACB. If not provided, all authorities on that ACB will be removed for that user.",
        request: '/acbs/:id/remove_user/:id',
        requestType: 'POST',
        security: 'Admin or ACB Admin',
        response: apis.entities.success
    },{
        category: 'ACBs',
        description: 'List all ACB Admin or Staff with access to the parameterized ACB',
        request: '/acbs/:id/users/',
        requestType: 'GET',
        security: 'Admin or ACB Admin',
        response: [apis.entities.userWithPermissions]
    },{
        category: 'ACBs',
        description: 'Create an ACB',
        note: 'Will not have acbId in JSON request parameter',
        request: '/acbs/create',
        requestType: 'POST',
        jsonParameter: apis.entities.acb,
        security: 'Admin',
        response: apis.entities.success
    },{
        category: 'ACBs',
        description: 'Modify an already existing ACB',
        request: '/acbs/update',
        requestType: 'POST',
        jsonParameter: apis.entities.acb,
        security: 'Admin',
        response: apis.entities.success
    },{
        category: 'Activity',
        description: 'Get a list of all certified product activity. If an id is passed in, will return only the activity for that product',
        request: '/activity/certified_products/(:id)(?lastNDays)',
        requestType: 'GET',
        parameters: 'lastNDays = number of days of activity to return. If not supplied, defaults to ALL',
        security: 'Admin',
        response: [apis.entities.activity]
    },{
        category: 'Activity',
        description: 'Get a list of vendor activity. If an id is passed in, will return only the activity for that vendor',
        request: '/activity/vendors/(:id)(?lastNDays)',
        requestType: 'GET',
        parameters: 'lastNDays = number of days of activity to return. If not supplied, defaults to ALL',
        security: 'Admin',
        response: [apis.entities.vendorActivity]
    },{
        category: 'Activity',
        description: 'Get a list of product activity. If an id is passed in, will return only the activity for that product',
        request: '/activity/products/(:id)(?lastNDays)',
        requestType: 'GET',
        parameters: 'lastNDays = number of days of activity to return. If not supplied, defaults to ALL',
        security: 'Admin',
        response: [apis.entities.productActivity]
    },{
        category: 'Activity',
        description: 'Get a list of the acb activity. If the logged in user is a CHPL admin, this will return all activity from all ACBs. If the user is an ACB admin, this will return a filtered list of activity; including only those the user has ACB admin rights over.',
        request: '/activity/acbs/(:id)(?lastNDays)',
        requestType: 'GET',
        parameters: 'lastNDays = number of days of activity to return. If not supplied, defaults to ALL',
        security: 'Admin',
        response: [apis.entities.acbActivity]
    },{
        category: 'Authentication',
        description: 'Log into administration section',
        request: '/auth/authenticate',
        requestType: 'POST',
        jsonParameter: {subjectName: 'string', password: 'string'},
        response: apis.entities.success
    },{
        category: 'Authentication',
        description: 'Change logged in user\'s password',
        request: '/auth/change_password',
        requestType: 'POST',
        security: 'Admin',
        jsonParameter: {password: 'string'},
        response: apis.entities.success
    },{
        category: 'Authentication',
        description: 'Refresh login token with new expiration time',
        request: '/auth/keep_alive',
        requestType: 'POST',
        security: 'Admin',
        response: {token: 'string'}
    },{
        category: 'Authentication',
        description: 'Reset password and send an email to account owner with new password',
        request: '/auth/reset_password',
        requestType: 'POST',
        jsonParameter: {userName:'string',email:'email'},
        response: apis.entities.success
    },{
        category: 'Certified Products',
        description: 'Get a summarized list of all Certified Products',
        request: '/certified_products/(?versionId)',
        requestType: 'GET',
        parameters: 'versionId: returns only those Certified Products associated with that Version',
        response: [apis.entities.cps]
    },{
        category: 'Certified Products',
        description: 'Get all details for specific Certified Product',
        request: '/certified_products/:id/details',
        requestType: 'GET',
        response: apis.entities.certifiedProduct
    },{
        category: 'Certified Products',
        description: 'Update a certified product with the passed in data',
        request: '/certified_products/update',
        requestType: 'POST',
        jsonParameter: {
            'id': 'long',
            'testingLabId': 'long',
            'certificationBodyId': 'long',
            'practiceTypeId': 'long',
            'productClassificationTypeId': 'long',
            'certificationStatusId': 'long',
            'chplProductNumber': 'string',
            'reportFileLocation': 'string',
            'qualityManagementSystemAtt': 'string',
            'acbCertificationId': 'string',
            'otherAcb': 'string',
            'isChplVisible': 'boolean'
        },
        security: 'Admin',
        response: apis.entities.certifiedProduct
    },{
        category: 'Certified Products',
        description: 'Provides end point for reception of Certified Product upload file. File must be in .csv or .xls(x) format',
        request: '/certified_products/upload',
        requestType: 'POST',
        jsonParameter: {file: 'file'},
        security: 'Admin',
        response: apis.entities.success
    },{
        category: 'Certified Products',
        description: 'Retrieve the Certified Products that are in the process of being uploaded into the CHPL database, filtered to those those that are being certified by an ACB to which that user has access',
        request: '/certified_products/pending/',
        requestType: 'GET',
        security: 'ACBAdmin',
        response: [{cpId: 'long', vendor: apis.entities.vendor, product: apis.entities.product, version: apis.entities.version, certified_product: 'all the parts of a cp in the process of uploading', uploadDate: 'string'}]
    },{
        category: 'Certified Products',
        description: 'Confirm a particular Certified Product is ready to be entered in the CHPL database permanently',
        request: '/certified_products/pending/confirm',
        requestType: 'POST',
        security: 'ACBAdmin',
        response: apis.entities.success
    },{
        category: 'Certified Products',
        description: 'Reject a particular pending Certified Product',
        request: '/certified_products/pending/:id/reject',
        requestType: 'POST',
        security: 'ACBAdmin',
        response: apis.entities.success
    },{
        category: 'Data',
        description: 'Returns all Certification Bodies',
        request: '/data/certification_bodies',
        requestType: 'GET',
        response: [{id: 'long', name: 'string'}]
    },{
        category: 'Data',
        description: 'Returns all Certification Editions',
        request: '/data/certification_editions',
        requestType: 'GET',
        response: [{id: 'long', name: 'string'}]
    },{
        category: 'Data',
        description: 'Returns all certification statuses',
        request: '/data/certification_statuses',
        requestType: 'GET',
        response: [{id: 'long', name: 'string'}]
    },{
        category: 'Data',
        description: 'Returns all Classification types',
        request: '/data/classification_types',
        requestType: 'GET',
        response: [{id: 'long', name: 'string'}]
    },{
        category: 'Data',
        description: 'Returns all Practice types',
        request: '/data/practice_types',
        requestType: 'GET',
        response: [{id: 'long', name: 'string'}]
    },{
        category: 'Data',
        description: 'Returns all parameters needed for search options',
        request: '/data/search_options',
        requestType: 'GET',
        response: {
            certBodyNames: [{id: 'long', name: 'string'}],
            certificationCriterionNumbers: [{id: 'long', name: 'string', title: 'string'}],
            certificationStatuses: [{id: 'long', name: 'string'}],
            cqmCriterionNumbers: [{id: 'long', name: 'string', title: 'string'}],
            editions: [{id: 'long', name: 'string'}],
            practiceTypeNames: [{id: 'long', name: 'string'}],
            productClassifications: [{id: 'long', name: 'string'}],
            productNames: [{id: 'long', name: 'string'}],
            vendorNames: [{id: 'long', name: 'string'}]
        }
    },{
        category: 'Products',
        description: 'Returns all products, or only single passed in product',
        request: '/products/(:id)(?vendorId)',
        requestType: 'GET',
        parameters: 'vendorId: optional developer identifier. If present, filters results to only those products owned by relevant Developer',
        response: [apis.entities.product]
    },{
        category: 'Products',
        description: 'Update one or more products with passed in data. If more than one productId is supplied, merge the products, assigning all versions originally assigned to any of the products to the single resulting product. If a newVendorId is supplied in the Request, the Product is changing ownership; merge the products (if necessary), and then reassign it to the new Vendor indicated',
        note: 'The Product object in the Request parameter will not have a productId or lastModifiedDate field',
        request: '/products/update',
        requestType: 'POST',
        jsonParameter: {'productIds': ['long'], product: apis.entities.product, newVendorId: 'long (optional)'},
        security: 'Admin',
        response: apis.entities.product
    },{
        category: 'Search',
        description: 'Provides an endpoint for performing a search',
        request: '/search/',
        requestType: 'POST',
        jsonParameter: apis.entities.searchRequest,
        response: apis.entities.searchResults
    },{
        category: 'Search',
        description: 'Provides an endpoint for performing a search',
        request: '/search/(?searchTerm)(?pageNum)(?pageSize)(?orderBy)',
        requestType: 'GET',
        parameters: ['searchTerm (optional): what phrase or word to search by',
                     'pageNum (optional): which page of results to return',
                     'pageSize (optional): how many results per page',
                     'orderBy (optional): what field to sort by'],
        response: apis.entities.searchResults
    },{
        category: 'Users',
        description: 'List all CHPL users',
        request: '/users/',
        requestType: 'GET',
        parameters: null,
        response: [apis.entities.userWithPermissions]
    },{
        category: 'Users',
        description: 'Create a user. Do not grant any special permissions. Requires invitation hash',
        note: 'The request json object will not have the userId, but will have a password.',
        request: '/users/create',
        requestType: 'POST',
        jsonParameter: apis.entities.user
    },{
        category: 'Users',
        description: 'Authorize a previously user to have access to pre-determined ACB or role(s)',
        request: '/users/authorize',
        requestType: 'POST',
        jsonParameter: {userName: 'string', hash: 'string'}
    },{
        category: 'Users',
        description: 'Confirm a user\'s account information',
        request: '/users/confirm',
        requestType: 'POST',
        jsonParameter: {userName: 'string', hash: 'string'}
    },{
        category: 'Users',
        description: 'Disable a user\'s access to CHPL entirely',
        request: '/users/delete',
        requestType: 'POST',
        security: 'Admin',
        jsonParamter: {userId: 'long'},
        response: apis.entities.success
    },{
    	category: 'Users',
        description: 'Add a role for the user. One of ROLE_ACB_STAFF, and ROLE_ACB_ADMIN',
        request: '/users/grant_role',
        requestType: 'POST',
        jsonParameter: apis.entities.grantRole,
        security: 'Admin',
        response: {"roleAdded": "true"}
    },{
    	category: 'Users',
        description: 'Remove a role for the user. One of ROLE_ACB_STAFF, and ROLE_ACB_ADMIN',
        request: '/users/revoke_role',
        requestType: 'POST',
        jsonParameter: apis.entities.grantRole,
        security: 'Admin',
        response: {"roleRemoved": "true"}
    },{
        category: 'Users',
        description: 'Invite a user to register their account',
        request: '/users/invite',
        requestType: 'POST',
        jsonParameter: {email: 'string', role: ['ROLE'], acb: ['acbId']},
        security: 'Admin',
        response: apis.entities.success
    },{
        category: 'Users',
        description: 'Modify a user',
        request: '/users/update',
        requestType: 'POST',
        jsonParameter: apis.entities.createdUser,
        security: 'Admin or the user themselves',
        response: apis.entities.success
    },{
        category: 'Developers',
        description: 'Returns all developers, or only single passed in Developer',
        request: '/vendors/(:id)',
        requestType: 'GET',
        response: [apis.entities.vendor]
    },{
        category: 'Developers',
        description: 'Update one or more developers with passed in data. If more than one vendorId is supplied, merge the developers, assigning all products originally assigned to any of the developers to the single resulting developer',
        note: 'The Developer object in the Request parameter will not have a developerId or lastModifiedDate field',
        request: '/vendors/update',
        requestType: 'POST',
        jsonParameter: {'vendorIds': ['long'], developer: apis.entities.vendor},
        security: 'Admin',
        response: apis.entities.vendor
    },{
        category: 'Versions',
        description: 'Returns all versions of given product, based on the passed in productId',
        request: '/versions/?productId=:productId',
        requestType: 'GET',
        response: [apis.entities.version]
    },{
        category: 'Versions',
        description: 'Returns one version with the corresponding versionId',
        request: '/versions/:versionId',
        requestType: 'GET',
        response: [apis.entities.version]
    },{
        category: 'Versions',
        description: 'Update one or more versions with passed in data. If more than one versionId is supplied, merge the versions, assigning all certified products originally assigned to any of the versions to the single resulting version',
        note: 'The Version object in the Request parameter will not have a versionId or lastModifiedDate field',
        request: '/versions/update',
        requestType: 'POST',
        jsonParameter: {'versionIds': ['long'], product: apis.entities.version},
        security: 'Admin',
        response: apis.entities.version
    }
];