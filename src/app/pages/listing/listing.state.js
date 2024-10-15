const states = [{
  name: 'listing',
  url: '/listing/{id}',
  component: 'chplListing',
  data: { title: 'CHPL Listing Details' },
}, {
  name: 'listing.edit-upload',
  url: '/edit-upload',
  component: 'chplListingEditUpload',
  data: {
    title: 'CHPL Listing Details - upload',
    roles: ['chpl-admin'],
  },
}, {
  name: 'listing.edit',
  url: '/edit',
  component: 'chplListingEditPage',
  data: {
    title: 'CHPL Listing Details - Edit',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
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
        networkService.getCodeSets().then((response) => { resources.codeSets = response; }),
        networkService.getConformanceMethods().then((response) => { resources.conformanceMethods = response; }),
        networkService.getFunctionalitiesTested().then((response) => { resources.functionalitiesTested = response; }),
        networkService.getMeasures().then((response) => { resources.measures = response; }),
        networkService.getMeasureTypes().then((response) => { resources.measureTypes = response; }),
        networkService.getOptionalStandards().then((response) => { resources.optionalStandards = response; }),
        networkService.getQmsStandards().then((response) => { resources.qmsStandards = response; }),
        networkService.getStandards().then((response) => { resources.standards = response; }),
        networkService.getSvaps().then((response) => { resources.svaps = response; }),
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
