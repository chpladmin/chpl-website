// Compares each ported React state tree against the AngularJS definitions it
// replaces, on every field that is framework-agnostic. This is transcription
// insurance for a 57-state port: it fails if a url, param, role or redirect
// drifts, which no build or lint would catch.
//
// Both sides are deleted together when AngularJS goes, so this file goes too.

import reactAdministration from './administration';
import reactCharts from './charts';
import reactCompare from './compare';
import reactComplianceDashboard from './compliance-dashboard';
import reactListing from './listing';
import reactOrganizations from './organizations';
import reactRegistration from './registration';
import reactReports from './reports';
import reactResources from './resources';
import reactSearch from './search';
import reactSubscriptions from './subscriptions';
import reactSurveillance from './surveillance';
import reactUsers from './users';

import { states as angularAdministration } from 'pages/administration/administration.state';
import { states as angularCharts } from 'pages/charts/charts.state';
import { states as angularCompare } from 'pages/compare/compare.state';
import { states as angularComplianceDashboard } from 'pages/compliance-dashboard/compliance-dashboard.state';
import { states as angularListing } from 'pages/listing/listing.state';
import { states as angularOrganizations } from 'pages/organizations/organizations.state';
import { states as angularRegistration } from 'pages/registration/registration.state';
import { states as angularReports } from 'pages/reports/reports.state';
import { states as angularResources } from 'pages/resources/resources.state';
import { states as angularSearch } from 'pages/search/search.state';
import { states as angularSubscriptions } from 'pages/subscriptions/subscriptions.state';
import { states as angularSurveillance } from 'pages/surveillance/surveillance.state';
import { states as angularUsers } from 'pages/users/users.state';

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

// Every state that read a url param through an Angular shuttle component now
// resolves it instead, because UIView forwards resolves as props but not params.
const resolvesParamInstead = (token) => ({ resolves: [token] });

const areas = [
  ['administration', angularAdministration, reactAdministration, {
    'administration.confirm.listings.listing': resolvesParamInstead('id'),
  }],
  ['charts', angularCharts, reactCharts, {}],
  ['compare', angularCompare, reactCompare, {}],
  ['compliance-dashboard', angularComplianceDashboard, reactComplianceDashboard, {}],
  ['listing', angularListing, reactListing, {
    listing: resolvesParamInstead('id'),
  }],
  ['organizations', angularOrganizations, reactOrganizations, {
    'organizations.developers.developer': resolvesParamInstead('id'),
  }],
  ['registration', angularRegistration, reactRegistration, {}],
  ['reports', angularReports, reactReports, {}],
  ['resources', angularResources, reactResources, {}],
  ['search', angularSearch, reactSearch, {}],
  ['subscriptions', angularSubscriptions, reactSubscriptions, {}],
  ['surveillance', angularSurveillance, reactSurveillance, {}],
  ['users', angularUsers, reactUsers, {}],
];

const allReactStates = areas.flatMap(([, , react]) => react);

describe('the ported state tree matches the AngularJS definitions', () => {
  it.each(areas)('%s', (_name, angular, react, expectedDifferences) => {
    compare(angular, react, expectedDifferences);
  });

  it('covers all 57 states', () => {
    expect(allReactStates).toHaveLength(57);
  });

  it('gives every state a component, since a parent without one renders nothing', () => {
    allReactStates
      .filter((state) => !state.redirectTo)
      .forEach((state) => {
        expect(typeof state.component).toBe('function');
      });
  });

  it('has no duplicate state names', () => {
    const names = allReactStates.map((state) => state.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
