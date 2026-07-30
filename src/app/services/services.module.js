import getApiKey from 'api/api-key';

export default angular
  .module('chpl.services', [
    'cfp.loadingBar',
    'chpl.constants',
    'ngFileSaver',
  ])
  .constant('API_KEY', getApiKey());
