// Compares each ported React state tree against the AngularJS definitions it
// replaces, on every field that is framework-agnostic. This is transcription
// insurance for a 57-state port: it fails if a url, param, role or redirect
// drifts, which no build or lint would catch.
//
// Both sides are deleted together when AngularJS goes, so this file goes too.

import reactCharts from './charts';
import reactComplianceDashboard from './compliance-dashboard';
import reactUsers from './users';
import reactCompare from './compare';
import reactListing from './listing';

import { states as angularCharts } from 'pages/charts/charts.state';
import { states as angularComplianceDashboard } from 'pages/compliance-dashboard/compliance-dashboard.state';
import { states as angularUsers } from 'pages/users/users.state';
import { states as angularCompare } from 'pages/compare/compare.state';
import { states as angularListing } from 'pages/listing/listing.state';

// AngularJS takes resolves as an object keyed by token; @uirouter/react takes
// an array of { token, deps, resolveFn }. Compare the token names only.
const resolveTokens = (resolve) => {
  if (!resolve) { return []; }
  if (Array.isArray(resolve)) { return resolve.map((r) => r.token).sort(); }
  return Object.keys(resolve).sort();
};

// `component` is a string on the Angular side and a function on the React
// side, and `template` has no React equivalent, so compare only whether the
// state renders something of its own.
const comparable = (state) => ({
  name: state.name,
  url: state.url,
  abstract: state.abstract === true,
  params: state.params ?? null,
  data: state.data ?? null,
  resolves: resolveTokens(state.resolve),
  redirect: typeof state.redirectTo === 'function' ? 'function' : (state.redirectTo ?? null),
  rendersSomething: Boolean(state.component || state.template),
});

// Intentional divergences, keyed by state name. Anything not listed here must
// match exactly, so every deliberate change has to be written down.
const compare = (angular, react, expectedDifferences = {}) => {
  expect(react.map((s) => s.name)).toEqual(angular.map((s) => s.name));
  angular.forEach((angularState, i) => {
    const expected = {
      ...comparable(angularState),
      ...(expectedDifferences[angularState.name] ?? {}),
    };
    expect(comparable(react[i])).toEqual(expected);
  });
};

describe('the ported state tree matches the AngularJS definitions', () => {
  it.each([
    ['charts', angularCharts, reactCharts, {}],
    ['compliance-dashboard', angularComplianceDashboard, reactComplianceDashboard, {}],
    ['users', angularUsers, reactUsers, {}],
    ['compare', angularCompare, reactCompare, {}],
    ['listing', angularListing, reactListing, {
      // AngularJS read $stateParams.id in the chplListing component and passed
      // it to the bridge as a binding; the React side resolves it instead,
      // because UIView only forwards resolves as props.
      listing: { resolves: ['id'] },
    }],
  ])('%s', (_name, angular, react, expectedDifferences) => {
    compare(angular, react, expectedDifferences);
  });

  it('gives every ported state a component, since a bare parent renders nothing', () => {
    [reactCharts, reactComplianceDashboard, reactUsers, reactCompare, reactListing]
      .flat()
      .filter((state) => !state.redirectTo)
      .forEach((state) => {
        expect(typeof state.component).toBe('function');
      });
  });
});
