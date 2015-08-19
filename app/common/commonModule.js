;(function () {
    'use strict';

    angular.module('app.common', [])
        .constant('API', 'http://localhost:8080/chpl-service')
        .constant('RealAPI', '/rest')
        .constant('devAPI', 'http://ainq.com');
})();
