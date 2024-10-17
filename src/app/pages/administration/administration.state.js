/** @ngInject */
function returnTo($transition$) {
  if ($transition$.redirectedFrom() != null) {
    return $transition$.redirectedFrom().targetState();
  }

  const $state = $transition$.router.stateService;

  if ($transition$.from().name !== '') {
    return $state.target($transition$.from(), $transition$.params('from'));
  }

  return $state.target('search');
}

const states = [{
  name: 'authorizePasswordReset',
  url: '/admin/authorizePasswordReset?token',
  redirectTo: (trans) => ({
    state: 'administration',
    params: {
      token: trans.params().token,
    },
  }),
}, {
  name: 'administration',
  url: '/administration?token',
  component: 'chplAdministration',
  data: { title: 'CHPL Administration' },
}, {
  name: 'administration.api-keys',
  url: '/api-keys',
  component: 'chplApiKeys',
  resolve: {
    apiKeys: (authService, networkService) => {
      'ngInject';

      if (authService.hasAnyRole(['chpl-admin', 'chpl-onc'])) {
        return networkService.getApiUsers();
      }
      return [];
    },
  },
  data: {
    title: 'CHPL Administration - API Keys',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.change-requests',
  url: '/change-requests',
  component: 'chplChangeRequestsWrapperBridge',
  data: {
    title: 'CHPL Administration - Change Requests',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.cms',
  url: '/cms',
  component: 'chplCmsWrapperBridge',
  data: {
    title: 'CHPL Administration - CMS',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-cms-staff'],
  },
}, {
  name: 'administration.confirm',
  abstract: true,
  url: '/confirm',
  template: '<ui-view/>',
}, {
  name: 'administration.confirm.listings',
  url: '/listings',
  component: 'chplConfirmListings',
  data: {
    title: 'CHPL Administration - Confirm Listings',
    roles: ['chpl-admin', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.confirm.listings.listing',
  url: '/{id}/confirm',
  component: 'chplConfirmListing',
  resolve: {
    developers: (networkService) => {
      'ngInject';

      return networkService.getDevelopers().then((response) => response.developers);
    },
    listing: (networkService, $transition$) => {
      'ngInject';

      return networkService.getPendingListingById($transition$.params().id);
    },
  },
  data: {
    title: 'CHPL Administration - Confirm Listing',
    roles: ['chpl-admin', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.reports',
  url: '/reports',
  component: 'chplReportsWrapperBridge',
  data: {
    title: 'CHPL Administration - Reports',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.system-maintenance',
  url: '/system-maintenance',
  component: 'chplSystemMaintenanceWrapperBridge',
  data: {
    title: 'CHPL Administration - System Maintenance',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'administration.upload',
  url: '/upload',
  component: 'chplUploadPageWrapperBridge',
  data: {
    title: 'CHPL Administration - Upload',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'login',
  url: '/login',
  component: 'chplLoginPageBridge',
  resolve: { returnTo },
  data: { title: 'CHPL Login' },
}];

function administrationStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export { administrationStatesConfig, states };
