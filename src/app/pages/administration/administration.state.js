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

const states = [
  {
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
    name: 'administration.announcements',
    url: '/announcements',
    component: 'chplAnnouncementsWrapperBridge',
    data: {
      title: 'CHPL Administration - Announcements',
      roles: ['ROLE_ADMIN', 'ROLE_ONC'],
    },
  }, {
    name: 'administration.api-keys',
    url: '/api-keys',
    component: 'chplApiKeys',
    resolve: {
      apiKeys: (authService, networkService) => {
        'ngInject';

        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
          return networkService.getApiUsers();
        }
        return [];
      },
    },
    data: {
      title: 'CHPL Administration - API Keys',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'administration.change-requests',
    url: '/change-requests',
    component: 'chplChangeRequestsWrapperBridge',
    data: {
      title: 'CHPL Administration - Change Requests',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'administration.cms',
    url: '/cms',
    component: 'chplCmsWrapperBridge',
    data: {
      title: 'CHPL Administration - CMS',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_CMS_STAFF'],
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
      roles: ['ROLE_ADMIN', 'ROLE_ACB'],
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
      roles: ['ROLE_ADMIN', 'ROLE_ACB'],
    },
  }, {
    name: 'administration.fuzzy-matching',
    url: '/fuzzy-matching',
    component: 'chplFuzzyMatching',
    resolve: {
      fuzzyTypes: (authService, networkService) => {
        'ngInject';

        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
          return networkService.getFuzzyTypes();
        }
        return [];
      },
    },
    data: {
      title: 'CHPL Administration - Fuzzy Matching',
      roles: ['ROLE_ADMIN', 'ROLE_ONC'],
    },
  }, {
    name: 'administration.jobs',
    url: '/jobs',
    component: 'chplJobsWrapperBridge',
    data: {
      title: 'CHPL Administration - Jobs - Scheduled',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'],
    },
  }, {
    name: 'administration.jobs.scheduled',
    url: '/scheduled',
    redirectTo: () => ({
      state: 'administration.jobs',
    }),
  }, {
    name: 'administration.standards',
    url: '/standards',
    component: 'chplStandardsWrapperBridge',
    data: {
      title: 'CHPL Administration - Standards &amp; Processes',
      roles: ['ROLE_ADMIN', 'ROLE_ONC'],
    },
  }, {
    name: 'administration.svaps',
    url: '/svaps',
    component: 'chplSvapsPage',
    resolve: {
      svaps: (authService, networkService) => {
        'ngInject';

        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
          return networkService.getSvaps();
        }
        return [];
      },
      availableCriteria: (networkService) => {
        'ngInject';

        return networkService.getCertificationCriteriaForSvap();
      },
    },
    data: {
      title: 'CHPL Administration - SVAPs',
      roles: ['ROLE_ADMIN', 'ROLE_ONC'],
    },
  }, {
    name: 'administration.upload',
    url: '/upload',
    component: 'chplUpload',
    data: {
      title: 'CHPL Administration - Upload',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
    },
  }, {
    name: 'login',
    url: '/login',
    component: 'chplLoginPageBridge',
    resolve: { returnTo },
    data: { title: 'CHPL Login' },
  },
];

function administrationStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export { administrationStatesConfig, states };
