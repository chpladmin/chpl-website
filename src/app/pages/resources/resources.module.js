import 'angular-swagger-ui';

export default angular
    .module('chpl.resources', [
        'chpl.constants',
        'chpl.services',
        'feature-flags',
        'ngStorage',
        'swaggerUi',
    ]);
