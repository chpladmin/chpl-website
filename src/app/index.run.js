import { Visualizer } from '@uirouter/visualizer';
import { states as dashboardStates } from './pages/dashboard/dashboard.state.js';
import { states as surveillanceStates } from './pages/surveillance/surveillance.state.js';

(() => {
    'use strict';

    angular
        .module('chpl')
        .run(runBlock);

    /** @ngInject */
    function runBlock ($anchorScroll, $http, $location, $log, $rootScope, $state, $stateParams, $timeout, $transitions, $uiRouter, $window, authService, featureFlags, networkService) {

        let loadFlags = () => {
            // get flag state from API
            featureFlags.set($http.get('/rest/feature-flags'))
                .then(() => {
                    let needsReload = false;
                    let needsRedirect = false;

                    // load states dependent on features
                    if (featureFlags.isOn('role-developer')) {
                        dashboardStates['role-developer'].forEach(state => {
                            if ($uiRouter.stateRegistry.get(state.name)) {
                                $uiRouter.stateRegistry.deregister(state.name);
                            }
                            $uiRouter.stateRegistry.register(state);
                            needsReload = needsReload || $state.$current.name === state.name;
                        });
                    } else {
                        dashboardStates['role-developer'].forEach(state => {
                            $uiRouter.stateRegistry.deregister(state.name);
                            needsRedirect = needsRedirect || $state.$current.name === state.name;
                        });
                    }

                    if (featureFlags.isOn('surveillance-reporting')) {
                        surveillanceStates['surveillance-reports-on'].forEach(state => {
                            if ($uiRouter.stateRegistry.get(state.name)) {
                                $uiRouter.stateRegistry.deregister(state.name);
                            }
                            $uiRouter.stateRegistry.register(state);
                            needsReload = needsReload || $state.$current.name === state.name;
                        });
                    } else {
                        surveillanceStates['surveillance-reports-on'].forEach(state => {
                            if ($uiRouter.stateRegistry.get(state.name)) {
                                $uiRouter.stateRegistry.deregister(state.name);
                            }
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
        };

        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
            networkService.keepalive()
                .then(() => {
                    loadFlags();
                }).catch(error => {
                    $log.info('error', error);
                    authService.logout();
                    loadFlags();
                });
        } else {
            loadFlags();
        }

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
    }
})();
