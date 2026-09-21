import PassthroughView from '../passthrough-view';
import AdministrationView from '../views/administration-view';
import ConfirmListingsView from '../views/confirm-listings-view';

import ChplChangeRequestsWrapper from 'components/change-request/change-requests-wrapper';
import ChplCmsWrapper from 'pages/administration/cms/cms-wrapper';
import ChplConfirmWrapper from 'pages/administration/confirm/confirm-wrapper';
import ChplLoginPage from 'pages/administration/login/login-wrapper';
import ChplReportsWrapper from 'pages/administration/reports/reports-wrapper';
import ChplSystemMaintenanceWrapper from 'pages/administration/system-maintenance/system-maintenance-wrapper';
import ChplUploadPageWrapper from 'pages/administration/upload/upload-page-wrapper';
import ChplUrlCheckerWrapper from 'pages/administration/url-checker/url-checker-wrapper';

// Where to send the user after a successful login. If the auth guard bounced
// them here, go back to what they originally asked for; otherwise back where
// they came from, falling back to search on a cold load.
//
// The resolved value is a TargetState, and login.jsx calls .state(), .params()
// and .options() on it, so the shape is part of that component's prop contract.
const returnTo = (transition) => {
  if (transition.redirectedFrom() != null) {
    return transition.redirectedFrom().targetState();
  }

  const { stateService } = transition.router;

  if (transition.from().name !== '') {
    return stateService.target(transition.from(), transition.params('from'));
  }

  return stateService.target('search');
};

const states = [{
  name: 'authorizePasswordReset',
  url: '/admin/authorizePasswordReset?token',
  redirectTo: (transition) => ({
    state: 'administration',
    params: {
      token: transition.params().token,
    },
  }),
}, {
  name: 'administration',
  url: '/administration?token',
  component: AdministrationView,
  data: { title: 'CHPL Administration' },
}, {
  name: 'administration.change-requests',
  url: '/change-requests',
  component: ChplChangeRequestsWrapper,
  data: {
    title: 'CHPL Administration - Change Requests',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.cms',
  url: '/cms',
  component: ChplCmsWrapper,
  data: {
    title: 'CHPL Administration - CMS',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-cms-staff'],
  },
}, {
  name: 'administration.confirm',
  abstract: true,
  url: '/confirm',
  component: PassthroughView,
}, {
  name: 'administration.confirm.listings',
  url: '/listings',
  component: ConfirmListingsView,
  data: {
    title: 'CHPL Administration - Confirm Listings',
    roles: ['chpl-admin', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.confirm.listings.listing',
  url: '/{id}/confirm',
  component: ChplConfirmWrapper,
  // replaces the chplConfirm Angular component, which read $stateParams.id
  resolve: [
    { token: 'id', deps: ['$transition$'], resolveFn: (transition) => transition.params().id },
  ],
  data: {
    title: 'CHPL Administration - Confirm Listing',
    roles: ['chpl-admin', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.reports',
  url: '/reports',
  component: ChplReportsWrapper,
  data: {
    title: 'CHPL Administration - Reports',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.system-maintenance',
  url: '/system-maintenance',
  component: ChplSystemMaintenanceWrapper,
  data: {
    title: 'CHPL Administration - System Maintenance',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.upload',
  url: '/upload',
  component: ChplUploadPageWrapper,
  data: {
    title: 'CHPL Administration - Upload',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'administration.url-checker',
  url: '/url-checker',
  component: ChplUrlCheckerWrapper,
  data: {
    title: 'CHPL Administration - URL Checker',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'login',
  url: '/login',
  component: ChplLoginPage,
  resolve: [
    { token: 'returnTo', deps: ['$transition$'], resolveFn: returnTo },
  ],
  data: { title: 'CHPL Login' },
}];

export default states;
