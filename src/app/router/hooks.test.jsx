import { memoryLocationPlugin } from '@uirouter/react';

import createRouter from './create-router';
import registerHooks from './hooks';

import { setUser } from 'components/login/userInfo.slice';
import store from 'store';

// The role guard, page title and unmatched-url handling used to live in the
// AngularJS run and config blocks. These cover the behaviour that moved.

const states = [
  {
    name: 'search', url: '/search', component: () => null, data: { title: 'CHPL Search' },
  },
  {
    name: 'not-found', url: '/not-found', params: { target: { squash: true, value: null } }, component: () => null, data: { title: 'Error: page not found' },
  },
  {
    name: 'login', url: '/login', component: () => null, data: { title: 'CHPL Login' },
  },
  // abstract parent supplies roles; the child declares only a title
  {
    name: 'surveillance',
    abstract: true,
    url: '/surveillance',
    component: () => null,
    data: { title: 'CHPL Surveillance', roles: ['chpl-admin', 'chpl-onc-acb'] },
  },
  {
    name: 'surveillance.complaints',
    url: '/complaints',
    component: () => null,
    data: { title: 'Complaints' },
  },
];

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

// start() syncs the current url, which the '' -> /search rule turns into a
// transition. Let that finish so it cannot supersede what a test does next.
const build = async () => {
  const router = createRouter(states, { locationPlugin: memoryLocationPlugin });
  registerHooks(router);
  router.start();
  await settle();
  return router;
};

const signInAs = (role) => store.dispatch(setUser(role ? { role } : null));

describe('the router hooks', () => {
  afterEach(() => signInAs(null));

  it('sets the page title from state data', async () => {
    const router = await build();
    // the empty url already routed to search
    expect(document.title).toBe('CHPL Search');
    await router.stateService.go('not-found');
    expect(document.title).toBe('Error: page not found');
  });

  // Driven through the url rather than stateService.go, so that the
  // `location: false` behaviour is actually observable.
  it('sends an unauthorised user to login without changing the url', async () => {
    const router = await build();
    router.urlService.url('/surveillance/complaints');
    await settle();
    expect(router.globals.current.name).toBe('login');
    expect(router.urlService.parts().path).toBe('/surveillance/complaints');
  });

  it('lets an authorised user through', async () => {
    signInAs('chpl-onc-acb');
    const router = await build();
    await router.stateService.go('surveillance.complaints');
    expect(router.globals.current.name).toBe('surveillance.complaints');
  });

  // The guard must see roles inherited from the abstract parent. If data were
  // spread or serialised anywhere in the chain this would pass wide open.
  it('guards a child state that inherits its roles from an abstract parent', async () => {
    signInAs('chpl-cms-staff');
    const router = await build();
    await router.stateService.go('surveillance.complaints');
    expect(router.globals.current.name).toBe('login');
  });

  it('does not treat the login redirect as a transition error', async () => {
    const router = await build();
    await router.stateService.go('surveillance.complaints');
    // a superseded transition must not fall through to not-found
    expect(router.globals.current.name).toBe('login');
  });

  it('does not treat navigating to the current state as an error', async () => {
    const router = await build();
    expect(router.globals.current.name).toBe('search');
    // an ignored transition must not fall through to not-found
    await router.stateService.go('search').catch(() => {});
    expect(router.globals.current.name).toBe('search');
  });

  it('sends unmatched urls to not-found with the attempted url', async () => {
    const router = await build();
    await router.stateService.go('search');
    router.urlService.url('/no/such/page');
    await settle();
    expect(router.globals.current.name).toBe('not-found');
    expect(router.globals.params.target).toBe('/no/such/page');
  });

  it('routes the empty url to search', async () => {
    const router = await build();
    expect(router.globals.current.name).toBe('search');
  });
});
