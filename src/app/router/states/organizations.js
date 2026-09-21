import DevelopersView from '../views/developers-view';
import MainContentView from '../views/main-content-view';

import ChplDeveloper from 'pages/organizations/developers/developer/developer-wrapper';
import ChplOncOrganizations from 'pages/organizations/onc-organizations/onc-organizations-wrapper';

const states = [
  {
    name: 'organizations',
    abstract: true,
    url: '/organizations',
    component: MainContentView,
  }, {
    name: 'organizations.developers',
    url: '/developers',
    component: DevelopersView,
    data: { title: 'CHPL Developers' },
  }, {
    name: 'organizations.developers.developer',
    url: '/{id}',
    component: ChplDeveloper,
    // replaces the chplDeveloperPage Angular component, which read
    // $stateParams.id and passed it to the bridge as a binding
    resolve: [
      { token: 'id', deps: ['$transition$'], resolveFn: (transition) => transition.params().id },
    ],
    data: { title: 'CHPL Developer' },
  }, {
    name: 'organizations.onc-acbs',
    url: '/onc-acbs',
    component: ChplOncOrganizations,
    resolve: [
      { token: 'orgType', deps: [], resolveFn: () => 'acb' },
    ],
    data: {
      title: 'CHPL ONC-ACBs',
      roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    },
  }, {
    name: 'organizations.onc-atls',
    url: '/onc-atls',
    component: ChplOncOrganizations,
    resolve: [
      { token: 'orgType', deps: [], resolveFn: () => 'atl' },
    ],
    data: {
      title: 'CHPL ONC-ATLs',
      roles: ['chpl-admin', 'chpl-onc'],
    },
  },
];

export default states;
