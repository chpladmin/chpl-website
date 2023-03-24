const states = [
  {
    name: 'organizations',
    abstract: true,
    url: '/organizations',
    component: 'chplOrganizations',
    ncyBreadcrumb: {
      label: 'Organizations',
    },
  }, {
    name: 'organizations.developers',
    url: '/developers',
    template: '<ui-view><chpl-developers-wrapper-bridge></chpl-developers-wrapper-bridge></ui-view>',
    data: { title: 'CHPL Developers' },
  }, {
    name: 'organizations.developers.developer',
    url: '/{id}',
    component: 'chplDeveloperView',
    resolve: {
      developer: (networkService, $location, $transition$) => {
        'ngInject';

        if (!$transition$.params().id) {
          $location.path('/organizations/developers');
        }
        return networkService.getDeveloperHierarchy($transition$.params().id);
      },
    },
    data: { title: 'CHPL Developers' },
  }, {
    name: 'organizations.developers.developer.edit',
    url: '/edit',
    views: {
      'view@^': 'chplDevelopersEdit',
    },
    data: {
      title: 'CHPL Developers - Edit',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_DEVELOPER'],
    },
  }, {
    name: 'organizations.developers.developer.split',
    url: '/split',
    views: {
      'view@^': 'chplDevelopersSplit',
    },
    data: {
      title: 'CHPL Developers - Split',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.developers.developer.join',
    url: '/join',
    views: {
      'view@^': 'chplDevelopersJoin',
    },
    data: {
      title: 'CHPL Developers - Join',
      roles: ['ROLE_ADMIN', 'ROLE_ONC'],
    },
  }, {
    name: 'organizations.developers.developer.merge',
    url: '/merge',
    views: {
      'view@^': 'chplDevelopersMerge',
    },
    resolve: {
      developers: (networkService) => {
        'ngInject';

        return networkService.getDevelopers();
      },
    },
    data: {
      title: 'CHPL Developers - Merge',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.developers.developer.attestation',
    url: '/attestation',
  }, {
    name: 'organizations.developers.developer.attestation.create',
    views: {
      'view@^.^': 'chplAttestationCreateWrapperBridge',
    },
    data: {
      title: 'CHPL Developers - Attestation',
      roles: ['ROLE_DEVELOPER'],
    },
  }, {
    name: 'organizations.developers.developer.attestation.edit',
    views: {
      'view@^.^': 'chplAttestationEditWrapperBridge',
    },
    params: {
      changeRequest: null,
    },
    resolve: {
      changeRequest: ($transition$) => {
        'ngInject';

        return $transition$.params().changeRequest;
      },
    },
    data: {
      title: 'CHPL Developers - Attestation',
      roles: ['ROLE_DEVELOPER'],
    },
  }, {
    name: 'organizations.developers.developer.product',
    url: '/products/{productId}',
    abstract: true,
  }, {
    name: 'organizations.developers.developer.product.edit',
    url: '/edit',
    views: {
      'products@^.^': 'chplProductsEdit',
    },
    data: {
      title: 'CHPL Developers - Edit Product',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.developers.developer.product.merge',
    url: '/merge',
    views: {
      'view@^.^': 'chplProductsMerge',
    },
    data: {
      title: 'CHPL Developers - Merge Product',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.developers.developer.product.split',
    url: '/split',
    views: {
      'view@^.^': 'chplProductsSplit',
    },
    data: {
      title: 'CHPL Developers - Split Product',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.developers.developer.product.version',
    url: '/versions/{versionId}',
    abstract: true,
  }, {
    name: 'organizations.developers.developer.product.version.edit',
    url: '/edit',
    views: {
      'products@^.^.^': 'chplVersionsEdit',
    },
    data: {
      title: 'CHPL Developers - Edit Version',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.developers.developer.product.version.merge',
    url: '/merge',
    views: {
      'view@^.^.^': 'chplVersionsMerge',
    },
    data: {
      title: 'CHPL Developers - Merge Version',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.developers.developer.product.version.split',
    url: '/split',
    views: {
      'view@^.^.^': 'chplVersionsSplit',
    },
    data: {
      title: 'CHPL Developers - Split Version',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'organizations.onc-acbs',
    url: '/onc-acbs',
    component: 'chplOncOrganizations',
    resolve: {
      allOrgs: (authService, networkService) => {
        'ngInject';

        return networkService.getAcbs(false);
      },
      editableOrgs: (authService, networkService) => {
        'ngInject';

        return networkService.getAcbs(true);
      },
      roles: () => ['ROLE_ACB'],
      key: () => 'acbs',
      type: () => 'ONC-ACB',
      functions: () => ({
        get: 'getAcbs',
        getUsers: 'getUsersAtAcb',
        modify: 'modifyACB',
        create: 'createACB',
        removeUser: 'removeUserFromAcb',
      }),
    },
    data: { title: 'CHPL ONC-ACBs' },
    ncyBreadcrumb: {
      label: 'ONC-ACBs',
    },
  }, {
    name: 'organizations.onc-acbs.organization',
    url: '/organization/{id}',
    component: 'chplOncOrganization',
    resolve: {
      organization: ($transition$, networkService) => {
        'ngInject';

        return networkService.getAcb($transition$.params().id);
      },
    },
    data: { title: 'CHPL ONC-ACB' },
    ncyBreadcrumb: {
      label: undefined, // must be filled in $onChanges in relevant component
    },
  }, {
    name: 'organizations.onc-acbs.organization.edit',
    url: '/edit',
    component: 'chplOncOrganizationEdit',
    data: {
      title: 'CHPL ONC-ACB',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
    ncyBreadcrumb: {
      label: 'Edit',
    },
  }, {
    name: 'organizations.onc-acbs.create',
    url: '/create',
    component: 'chplOncOrganizationEdit',
    data: {
      title: 'CHPL ONC-ACB',
      roles: ['ROLE_ADMIN', 'ROLE_ONC'],
    },
    ncyBreadcrumb: {
      label: 'Create',
    },
  }, {
    name: 'organizations.onc-atls',
    url: '/onc-atls',
    component: 'chplOncOrganizations',
    resolve: {
      allOrgs: (authService, networkService) => {
        'ngInject';

        return networkService.getAtls(false);
      },
      editableOrgs: (authService, networkService) => {
        'ngInject';

        return networkService.getAtls(true);
      },
      roles: () => ['ROLE_ATL'],
      key: () => 'atls',
      type: () => 'ONC-ATL',
      functions: () => ({
        get: 'getAtls',
        getUsers: 'getUsersAtAtl',
        modify: 'modifyATL',
        create: 'createATL',
        removeUser: 'removeUserFromAtl',
      }),
    },
    data: { title: 'CHPL ONC-ATLs' },
    ncyBreadcrumb: {
      label: 'ONC-ATLs',
    },
  }, {
    name: 'organizations.onc-atls.organization',
    url: '/organization/{id}',
    component: 'chplOncOrganization',
    resolve: {
      organization: ($transition$, networkService) => {
        'ngInject';

        return networkService.getAtl($transition$.params().id);
      },
    },
    data: { title: 'CHPL ONC-ATL' },
    ncyBreadcrumb: {
      label: undefined, // must be filled in $onChanges in relevant component
    },
  }, {
    name: 'organizations.onc-atls.organization.edit',
    url: '/edit',
    component: 'chplOncOrganizationEdit',
    data: {
      title: 'CHPL ONC-ATL',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ATL'],
    },
    ncyBreadcrumb: {
      label: 'Edit',
    },
  }, {
    name: 'organizations.onc-atls.create',
    url: '/create',
    component: 'chplOncOrganizationEdit',
    data: {
      title: 'CHPL ONC-ATL',
      roles: ['ROLE_ADMIN', 'ROLE_ONC'],
    },
    ncyBreadcrumb: {
      label: 'Create',
    },
  },
];

function organizationsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default organizationsStatesConfig;
