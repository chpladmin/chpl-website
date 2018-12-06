/* eslint-disable angular/no-private-call, angular/no-run-logic */
import { Visualizer } from '@uirouter/visualizer';

(function () {
    'use strict';

    angular
        .module('chpl')
        .run(runBlock);

    /** @ngInject */
    function runBlock ($anchorScroll, $location, $log, $rootScope, $timeout, $uiRouter, $window) {
        var routeChange = $rootScope.$on('$routeChangeSuccess', function (event, current) {
            if (current.$$route) {
                $rootScope.title = current.$$route.title;
                $rootScope.currentPage = $location.path();
            }
            if ($location.hash()) {
                $anchorScroll();
                $timeout(function () {
                    var element = $window.document.getElementById('main-content');
                    var elementAng = angular.element($window.document.getElementById('main-content'));
                    if (element && elementAng) {
                        elementAng.attr('tabindex', '-1');
                        element.focus();
                    }
                });
            }
        });
        $rootScope.$on('$destroy', routeChange);
        var pluginInstance = $uiRouter.plugin(Visualizer);
        $rootScope.$on('$destroy', pluginInstance);
    }
})();
