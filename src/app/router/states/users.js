import ChplUsersPage from 'pages/users/users-wrapper';

const states = [{
  name: 'users',
  url: '/users',
  component: ChplUsersPage,
  data: {
    title: 'CHPL Users',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}];

export default states;
