(function() {
    'use strict';
    angular.module('chpl.constants', [])
        .constant('ACTIVE_CAP', false)
        .constant('API', '/rest')
        .constant('CACHE_TIMEOUT', 60)
        .constant('CACHE_REFRESH_TIMEOUT', 300)
        .constant('MINUTES_BETWEEN_KEEPALIVE', 5)
        .constant('RELOAD_TIMEOUT', 3000)
        .constant('SPLIT_PRIMARY', '☺')
        .constant('SPLIT_SECONDARY', '☹');
})();
