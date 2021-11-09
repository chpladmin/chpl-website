const getResources = ($q, networkService) => {
  const promises = [
    networkService.getSearchOptions()
      .then((response) => ({
        bodies: response.acbs,
        classifications: response.productClassifications,
        editions: response.editions,
        practices: response.practiceTypes,
        statuses: response.certificationStatuses,
      })),
    networkService.getAtls(false)
      .then((response) => ({ testingLabs: response.atls })),
    networkService.getMeasures()
      .then((response) => ({ measures: response })),
    networkService.getMeasureTypes()
      .then((response) => ({ measureTypes: response })),
    networkService.getQmsStandards()
      .then((response) => ({ qmsStandards: response })),
    networkService.getAccessibilityStandards()
      .then((response) => ({ accessibilityStandards: response })),
    networkService.getUcdProcesses()
      .then((response) => ({ ucdProcesses: response })),
    networkService.getTestProcedures()
      .then((response) => ({ testProcedures: response })),
    networkService.getTestData()
      .then((response) => ({ testData: response })),
    networkService.getTestStandards()
      .then((response) => ({ testStandards: response })),
    networkService.getTestFunctionality()
      .then((response) => ({ testFunctionalities: response })),
    networkService.getTargetedUsers()
      .then((response) => ({ targetedUsers: response })),
  ];
  return $q.all(promises)
    .then((response) => response);
};

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

const states = {
  'change-request': [
    {
      name: 'administration.change-requests',
      url: '/change-requests',
      component: 'chplChangeRequestsManagement',
      data: {
        title: 'CHPL Administration - Change Requests',
        roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
      },
    },
  ],
  'enhanced-upload': [
    {
      name: 'administration.confirm.listings.listing',
      url: '/{id}/confirm',
      component: 'chplConfirmListing',
      resolve: {
        listing: (networkService, $transition$) => {
          'ngInject';

          return networkService.getPendingListingByIdBeta($transition$.params().id);
        },
      },
      data: {
        title: 'CHPL Administration - Confirm Listing',
        roles: ['ROLE_ADMIN', 'ROLE_ACB'],
      },
    },
  ],
  base: [
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
      component: 'chplAnnouncements',
      resolve: {
        announcements: (authService, networkService) => {
          'ngInject';

          if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
            return networkService.getAnnouncements(true);
          }
          return [];
        },
      },
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
      template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
      data: { title: 'CHPL Administration - Change Requests' },
    }, {
      name: 'administration.cms',
      url: '/cms',
      component: 'chplCms',
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
      resolve: {
        developers: (networkService) => {
          'ngInject';

          return networkService.getDevelopers().then((response) => response.developers);
        },
        resources: ($q, networkService) => {
          'ngInject';

          return getResources($q, networkService);
        },
      },
      data: {
        title: 'CHPL Administration - Confirm Listings',
        roles: ['ROLE_ADMIN', 'ROLE_ACB'],
      },
    }, {
      name: 'administration.confirm.listings.listing',
      url: '/{id}/confirm',
      template: '<div><i class="fa fa-spinner fa-spin"></i/>processing</div>',
      data: { title: 'CHPL Administration - Confirm Listing' },
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
      abstract: true,
      url: '/jobs',
      template: '<ui-view/>',
    }, {
      name: 'administration.jobs.scheduled',
      url: '/scheduled',
      component: 'chplJobsScheduledPage',
      resolve: {
        acbs: (networkService) => {
          'ngInject';

          return networkService.getAcbs(true);
        },
        jobs: (authService, networkService) => {
          'ngInject';

          if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'])) {
            return networkService.getScheduleJobs();
          }
          return [];
        },
        scheduledSystemJobs: (authService, networkService) => {
          'ngInject';

          if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'])) {
            return networkService.getScheduledSystemJobs();
          }
          return [];
        },
        triggers: (authService, networkService) => {
          'ngInject';

          if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'])) {
            return networkService.getScheduleTriggers();
          }
          return [];
        },
      },
      data: {
        title: 'CHPL Administration - Jobs - Scheduled',
        roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'],
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
      name: 'login',
      url: '/login',
      component: 'chplLoginPageBridge',
      resolve: { returnTo },
      data: { title: 'CHPL Login' },
    },
  ],
};

function administrationStatesConfig($stateProvider) {
  'ngInject';

  states.base.forEach((state) => {
    $stateProvider.state(state);
  });
}

export { administrationStatesConfig, states };
