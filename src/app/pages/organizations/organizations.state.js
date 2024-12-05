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
    component: 'chplDeveloperPage',
    data: { title: 'CHPL Developer' },
  }, {
    name: 'organizations.developers.developer.attestation',
    url: '/attestation',
    abstract: true,
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
      roles: ['chpl-developer'],
    },
  }, {
    name: 'organizations.developers.developer.product',
    url: '/products/{productId}',
    abstract: true,
  }, {
    name: 'organizations.developers.developer.product.edit',
    url: '/edit',
    views: {
      'view@^.^': 'chplProductsEdit',
    },
    data: {
      title: 'CHPL Developers - Edit Product',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
  }, {
    name: 'organizations.developers.developer.product.merge',
    url: '/merge',
    views: {
      'view@^.^': 'chplProductsMerge',
    },
    data: {
      title: 'CHPL Developers - Merge Product',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
    resolve: {
      developer: (networkService, $transition$) => {
        'ngInject';

        return networkService.getDeveloperHierarchy($transition$.params().id);
      },
    },
  }, {
    name: 'organizations.developers.developer.product.split',
    url: '/split',
    views: {
      'view@^.^': 'chplProductsSplit',
    },
    data: {
      title: 'CHPL Developers - Split Product',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
    resolve: {
      developer: (networkService, $transition$) => {
        'ngInject';

        return networkService.getDeveloperHierarchy($transition$.params().id);
      },
    },
  }, {
    name: 'organizations.developers.developer.product.version',
    url: '/versions/{versionId}',
    abstract: true,
  }, {
    name: 'organizations.developers.developer.product.version.edit',
    url: '/edit',
    views: {
      'view@^.^.^': 'chplVersionsEdit',
    },
    data: {
      title: 'CHPL Developers - Edit Version',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
  }, {
    name: 'organizations.developers.developer.product.version.merge',
    url: '/merge',
    views: {
      'view@^.^.^': 'chplVersionsMerge',
    },
    data: {
      title: 'CHPL Developers - Merge Version',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
    resolve: {
      developer: (networkService, $transition$) => {
        'ngInject';

        return networkService.getDeveloperHierarchy($transition$.params().id);
      },
    },
  }, {
    name: 'organizations.developers.developer.product.version.split',
    url: '/split',
    views: {
      'view@^.^.^': 'chplVersionsSplit',
    },
    data: {
      title: 'CHPL Developers - Split Version',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
    resolve: {
      developer: (networkService, $transition$) => {
        'ngInject';

        return networkService.getDeveloperHierarchy($transition$.params().id);
      },
    },
  }, {
    name: 'organizations.onc-acbs',
    url: '/onc-acbs',
    component: 'chplOncOrganizationsBridge',
    data: {
      title: 'CHPL ONC-ACBs',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
  }, {
    name: 'organizations.onc-atls',
    url: '/onc-atls',
    component: 'chplOncOrganizationsBridge',
    data: {
      title: 'CHPL ONC-ATLs',
      roles: ['chpl-admin', 'chpl-onc'],
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
