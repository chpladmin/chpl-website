;(function () {
    'use strict';

    angular.module('app.common', [])
        .constant('API', 'http://localhost:8080/chpl-service')
        .constant('searchAPI', 'http://ainq.com');
})();
