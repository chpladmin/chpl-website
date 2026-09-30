import { lazy } from 'react';

const states = [{
  name: 'users',
  url: '/users',
  component: lazy(() => import('pages/users/users-wrapper')),
  data: {
    title: 'CHPL Users',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}];

export default states;
