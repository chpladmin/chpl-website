import { Visualizer } from '@uirouter/visualizer';
import { states as listingStates } from './pages/listing/listing.state.js';
import { states as organizationsStates } from './pages/organizations/organizations.state.js';
import { states as surveillanceStates } from './pages/surveillance/surveillance.state.js';

(() => {
    'use strict';

    angular
        .module('chpl')
        .run(runBlock);

    /** @ngInject */
    function runBlock ($anchorScroll, $http, $location, $log, $rootScope, $state, $stateParams, $timeout, $transitions, $uiRouter, $window, authService, featureFlags, networkService) {

        // get flag state from API
        featureFlags.set($http.get('/rest/feature-flags'))
            .then(() => {
                let needsReload = false;
                let needsRedirect = false;
                // load states dependent on features
                if (featureFlags.isOn('listing-edit')) {
                    listingStates['listing-edit-on'].forEach(state => {
                        if ($uiRouter.stateRegistry.get(state.name)) {
                            $uiRouter.stateRegistry.deregister(state.name);
                        }
                        $uiRouter.stateRegistry.register(state);
                        needsReload = needsReload || $state.$current.name === state.name;
                    });
                } else {
                    listingStates['listing-edit-on'].forEach(state => {
                        if ($uiRouter.stateRegistry.get(state.name)) {
                            $uiRouter.stateRegistry.deregister(state.name);
                        }
                        needsRedirect = needsRedirect || $state.$current.name === state.name;
                    });
                }

                if (featureFlags.isOn('developer-page')) {
                    organizationsStates['enabled'].forEach(state => {
                        if ($uiRouter.stateRegistry.get(state.name)) {
                            $uiRouter.stateRegistry.deregister(state.name);
                        }
                        $uiRouter.stateRegistry.register(state);
                        needsReload = needsReload || $state.$current.name === state.name;
                    });
                } else {
                    organizationsStates['enabled'].forEach(state => {
                        if ($uiRouter.stateRegistry.get(state.name)) {
                            $uiRouter.stateRegistry.deregister(state.name);
                        }
                        needsRedirect = needsRedirect || $state.$current.name === state.name;
                    });
                }

                if (featureFlags.isOn('complaints')) {
                    surveillanceStates['complaints-on'].forEach(state => {
                        $uiRouter.stateRegistry.deregister(state.name);
                        $uiRouter.stateRegistry.register(state);
                        needsReload = needsReload || $state.$current.name === state.name;
                    });
                } else {
                    surveillanceStates['complaints-on'].forEach(state => {
                        $uiRouter.stateRegistry.deregister(state.name);
                        needsRedirect = needsRedirect || $state.$current.name === state.name;
                    });
                }
                if (featureFlags.isOn('surveillance-reporting')) {
                    surveillanceStates['surveillance-reports-on'].forEach(state => {
                        $uiRouter.stateRegistry.deregister(state.name);
                        $uiRouter.stateRegistry.register(state);
                        needsReload = needsReload || $state.$current.name === state.name;
                    });
                } else {
                    surveillanceStates['surveillance-reports-on'].forEach(state => {
                        $uiRouter.stateRegistry.deregister(state.name);
                        needsRedirect = needsRedirect || $state.$current.name === state.name;
                    });
                }

                // Display ui-router state changes
                if (featureFlags.isOn('states')) {
                    $uiRouter.plugin(Visualizer);
                }

                $rootScope.$broadcast('flags loaded');
                if (needsRedirect) {
                    $state.go('search');
                } else if (needsReload) {
                    $state.go($state.$current.name, $stateParams, {reload: true});
                }
            });

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
            $timeout(() => {
                var element = $window.document.getElementById('main-content');
                var elementAng = angular.element($window.document.getElementById('main-content'));
                if (element && elementAng) {
                    elementAng.attr('tabindex', '-1');
                    element.focus();
                }
            });
        }

        if (authService.hasAnyRole()) {
            networkService.keepalive()
                .catch(error => {
                    if (error.status === 401) {
                        authService.logout();
                        $state.reload();
                    }
                });
        }

    }
})();
