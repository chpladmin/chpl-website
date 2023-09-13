const states = [{
  name: 'listing',
  url: '/listing/{id}',
  component: 'chplListing',
  data: { title: 'CHPL Listing Details' },
}, {
  name: 'listing.flag-edit',
  url: '/flag-edit',
  component: 'chplListingEditFlagged',
  data: {
    title: 'CHPL Listing Details - new edit',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
  },
}, {
  name: 'listing.edit',
  url: '/edit',
  component: 'chplListingEditPage',
  data: {
    title: 'CHPL Listing Details - Edit',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
  },
  resolve: {
    listing: (networkService, $transition$) => {
      'ngInject';

      return networkService.getListing($transition$.params().id);
    },
    resources: ($q, networkService) => {
      'ngInject';

      const resources = {};
      return $q.all([
        networkService.getSearchOptions()
          .then((response) => {
            resources.bodies = response.acbs;
            resources.classifications = response.productClassifications;
            resources.editions = response.editions;
            resources.practices = response.practiceTypes;
            resources.statuses = response.certificationStatuses;
          }),
        networkService.getAccessibilityStandards().then((response) => { resources.accessibilityStandards = response; }),
        networkService.getAtls(false).then((response) => { resources.testingLabs = response.atls; }),
        networkService.getFunctionalitiesTested().then((response) => { resources.functionalitiesTested = response; }),
        networkService.getMeasures().then((response) => { resources.measures = response; }),
        networkService.getMeasureTypes().then((response) => { resources.measureTypes = response; }),
        networkService.getQmsStandards().then((response) => { resources.qmsStandards = response; }),
        networkService.getTargetedUsers().then((response) => { resources.targetedUsers = response; }),
        networkService.getTestData().then((response) => { resources.testData = response; }),
        networkService.getTestTools().then((response) => { resources.testTools = response; }),
        networkService.getTestProcedures().then((response) => { resources.testProcedures = response; }),
        networkService.getTestStandards().then((response) => { resources.testStandards = response; }),
        networkService.getUcdProcesses().then((response) => { resources.ucdProcesses = response; }),
      ]).then(() => resources);
    },
  },
}, {
  name: 'product',
  url: '/product/{id}',
  redirectTo: (trans) => ({
    state: 'listing',
    params: {
      id: trans.params().id,
    },
  }),
}];

function listingStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default listingStatesConfig;
