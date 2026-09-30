import { RejectType } from '@uirouter/react';

import store from '../store';

import { hasAnyRole } from 'services/auth.service';

// Everything the AngularJS run and config blocks did to the router lives here:
// the default and unmatched-url rules, the page title, the role guard, and
// error handling.

// Matches any transition to a state that declares roles. `data` is inherited
// through the prototype chain, so a child with only a title still matches via
// its abstract parent - do not spread or serialise `data` here.
const requiresAuthentication = { to: (state) => state.data && state.data.roles };

const scrollToAnchor = (id) => {
  const element = document.getElementById(id);
  if (!element) { return; }
  // matches components/util/internal-scroll-button
  element.setAttribute('tabindex', '-1');
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  element.focus();
};

const registerHooks = (router) => {
  const { stateService, transitionService, urlService } = router;

  // '' and '/' are both rewritten to /search. `rules.initial` only matches '/',
  // so an empty url would otherwise fall through to the otherwise rule below
  // and land on not-found.
  urlService.rules.when('', '/search');
  urlService.rules.when('/', '/search');

  // Unknown urls land on not-found, which reports the url it was given
  urlService.rules.otherwise(() => {
    const { path, search } = urlService.parts();
    const query = Object.entries(search ?? {})
      .map(([key, value]) => (value === null ? key : `${key}=${value}`))
      .join('&');
    return { state: 'not-found', params: { target: query ? `${path}?${query}` : path } };
  });

  // Role guard. `location: false` leaves the protected url in the address bar,
  // which is what lets the login state's returnTo resolve see redirectedFrom().
  transitionService.onBefore(requiresAuthentication, (transition) => {
    const { roles } = transition.to().data;
    if (roles && !hasAnyRole(store.getState().userInfo.user, roles)) {
      return stateService.target('login', undefined, { location: false });
    }
    return true;
  });

  transitionService.onSuccess({}, (transition) => {
    const { title } = transition.to().data ?? {};
    if (title) {
      document.title = title;
    }

    const { hash } = urlService.parts();
    if (hash) {
      // let the new view commit before looking for the anchor
      window.requestAnimationFrame(() => scrollToAnchor(hash));
    }
  });

  transitionService.onError({}, (transition) => {
    const error = transition.error();
    // A redirect (the guard sending an unauthorised user to login) and
    // navigating to the state you are already on are not failures. AngularJS
    // detected these by string-matching the rejection message; the rejection
    // type is the supported way.
    if (error.type === RejectType.SUPERSEDED || error.type === RejectType.IGNORED) {
      return;
    }
    stateService.go('not-found', { target: error.message });
  });

  // onError above is the real handler; this silences the duplicate
  // unhandled-rejection logging for every aborted or superseded transition.
  stateService.defaultErrorHandler(() => {});
};

export default registerHooks;
