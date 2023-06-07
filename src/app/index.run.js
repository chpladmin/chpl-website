(() => {
  /** @ngInject */
  function runBlock($anchorScroll, $http, $location, $log, $rootScope, $state, $stateParams, $timeout, $transitions, $window, Title, authService, featureFlags, networkService) {
    const loadFlags = () => {
      // get flag state from API
      featureFlags.set($http.get('/rest/feature-flags'))
        .then(() => {
          $rootScope.$broadcast('flags loaded');
        });
    };

    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_DEVELOPER'])) {
      networkService.keepalive()
        .then(() => {
          loadFlags();
        }).catch((error) => {
          $log.info('error', error);
          authService.logout();
          loadFlags();
        });
    } else {
      loadFlags();
    }

    // Update page title on state change
    $transitions.onSuccess({}, (transition) => {
      let { title } = transition.to().data;
      if (title) {
        if (title instanceof Function) {
          title = title.call(transition.to(), transition.params());
        }
        Title.value(title);

        // Set currentPage for internal page links
        $rootScope.currentPage = $location.path(); // eslint-disable-line no-param-reassign
      }

      // If there's an anchor, scroll to it
      if ($location.hash()) {
        const target = $location.hash();
        $anchorScroll();
        $timeout(() => {
          const element = $window.document.getElementById(target);
          const elementAng = angular.element($window.document.getElementById(target));
          if (element && elementAng) {
            elementAng.attr('tabindex', '-1');
            element.focus();
          }
        }, 0, false);
      }
    });

    const requiresAuthentication = {
      to: (state) => state.data && state.data.roles,
    };

    $transitions.onBefore(requiresAuthentication, (transition) => {
      const { roles } = transition.to().data;
      if (roles && !authService.hasAnyRole(roles)) {
        return transition.router.stateService.target('login', undefined, { location: false });
      }
      return true;
    });

    $transitions.onError({}, (transition) => {
      const error = transition.error();
      if ((!error.detail?.name || error.detail.name() !== 'login') && error.message !== 'The transition was ignored') {
        transition.router.stateService.go('not-found', {
          target: error.message,
        });
      }
    });

    $state.defaultErrorHandler(() => {
      // no op
    });
  }

  angular
    .module('chpl')
    .run(runBlock);
})();
