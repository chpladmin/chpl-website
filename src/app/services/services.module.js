(function () {
    'use strict';

    angular
        .module('chpl.services', [
            'cfp.loadingBar',
            'chpl.constants',
            'feature-flags',
            'ngFileSaver',
            'ngStorage',
        ])
        .constant('API_KEY', '12909a978483dfb8ecd0596c98ae9094');
})();
