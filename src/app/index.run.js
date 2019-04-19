/* global DEVELOPER_MODE ENABLE_LOGGING */
import { Visualizer } from '@uirouter/visualizer';

(function () {
    'use strict';

    angular
        .module('chpl')
        .run(runBlock);

    /** @ngInject */
    function runBlock ($anchorScroll, $location, $log, $rootScope, $timeout, $transitions, $uiRouter, $window) {

        // Update page title on state change
        $transitions.onSuccess({}, transition => {
            let title = transition.to().data.title;
            if (title) {
                if (title instanceof Function) {
                    title = title.call(transition.to(), transition.params());
                }
                $window.document.title = title;

                // Set currentPage for internal page links
                $rootScope.currentPage = $location.path();
            }
        });

        // If there's an anchor, scroll to it
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

        // Display ui-router state changes
        if (DEVELOPER_MODE && ENABLE_LOGGING) {
            $uiRouter.plugin(Visualizer);
        }
    }
})();
