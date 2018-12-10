/* eslint-disable angular/no-private-call, angular/no-run-logic */
import { Visualizer } from '@uirouter/visualizer';

(function () {
    'use strict';

    angular
        .module('chpl')
        .run(runBlock);

    /** @ngInject */
    function runBlock ($anchorScroll, $location, $log, $rootScope, $timeout, $transitions, $uiRouter, $window) {
/*
        $transitions.onSuccess({}, transition => {
            let title = transition.to().data.title;
            if (title) {
                if (title instanceof Function) {
                    title = title.call(transition.to(), transition.params());
                }
                $window.document.title = title;
            }
        });
        */
        //$rootScope.currentPage = $location.path();
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
        var pluginInstance = $uiRouter.plugin(Visualizer);
        $rootScope.$on('$destroy', pluginInstance);
    }
})();
