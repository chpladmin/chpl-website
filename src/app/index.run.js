(() => {
  /** @ngInject */
  function runBlock($anchorScroll, $location, $rootScope, $state, $timeout, $transitions, $window, Title, authService) {
    // Show a global loading indicator during every route transition.
    // UI-Router transitions without async resolves complete synchronously, so
    // onStart -> onSuccess can happen within a single frame and the overlay
    // would never actually paint. We keep it visible for a minimum duration so
    // the user always sees the custom loader whenever the URL changes.
    const loadingElement = $window.document.getElementById('chpl-route-loading');
    const MIN_VISIBLE_MS = 500;
    let shownAt = 0;
    let hideTimeout = null;

    const showRouteLoading = () => {
      if (!loadingElement) { return; }
      if (hideTimeout) {
        $timeout.cancel(hideTimeout);
        hideTimeout = null;
      }
      shownAt = Date.now();
      loadingElement.classList.add('is-active');
    };

    const hideRouteLoading = () => {
      if (!loadingElement) { return; }
      const elapsed = Date.now() - shownAt;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      if (hideTimeout) {
        $timeout.cancel(hideTimeout);
      }
      hideTimeout = $timeout(() => {
        loadingElement.classList.remove('is-active');
        hideTimeout = null;
      }, remaining);
    };

    $transitions.onStart({}, () => {
      showRouteLoading();
    });

    // Update page title on state change
    $transitions.onSuccess({}, (transition) => {
      hideRouteLoading();
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
      hideRouteLoading();
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
