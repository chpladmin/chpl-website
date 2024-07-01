import React from 'react';
import {
  cleanup, render, screen, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplChangeRequestHistory from './change-request-history';

const mock = {
  changeRequest: {
    statuses: [{
      id: 1,
      userGroupName: 'ROLE_ONC',
      statusChangeDateTime: '2022-03-21T04:25:32.000',
      changeRequestStatusType: { name: 'status by onc' },
      comment: 'onc comment',
    }, {
      id: 2,
      userGroupName: 'ROLE_ADMIN',
      statusChangeDateTime: '2022-03-21T04:20:32.000',
      changeRequestStatusType: { name: 'admin status' },
      comment: 'comment by admin',
    }, {
      id: 3,
      userGroupName: 'ROLE_ACB',
      statusChangeDateTime: '2022-03-21T04:30:32.000',
      changeRequestStatusType: { name: 'status done by ACB' },
      certificationBody: { name: 'an ACB' },
      comment: 'an acb comment',
    }, {
      id: 4,
      userGroupName: 'ROLE_DEVELOPER',
      statusChangeDateTime: '2022-03-21T04:23:32.000',
      changeRequestStatusType: { name: 'dev status' },
      comment: 'developers have comments too',
    }],
    developer: { name: 'a developer' },
  },
};

describe('the ChplChangeRequestHistory component', () => {
  beforeEach(async () => {
    render(
      <ChplChangeRequestHistory
        changeRequest={mock.changeRequest}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('should display history', () => {
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mock.changeRequest.statuses.length + 1);
    expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('an ACB');
    expect(within(rows[1]).getAllByRole('cell')[2]).toHaveTextContent('status done by ACB');
    expect(within(rows[1]).getAllByRole('cell')[3]).toHaveTextContent('an acb comment');
    expect(within(rows[2]).getAllByRole('cell')[0]).toHaveTextContent('ONC');
    expect(within(rows[2]).getAllByRole('cell')[2]).toHaveTextContent('status by onc');
    expect(within(rows[2]).getAllByRole('cell')[3]).toHaveTextContent('onc comment');
    expect(within(rows[3]).getAllByRole('cell')[0]).toHaveTextContent('a developer');
    expect(within(rows[3]).getAllByRole('cell')[2]).toHaveTextContent('dev status');
    expect(within(rows[3]).getAllByRole('cell')[3]).toHaveTextContent('developers have comments too');
    expect(within(rows[4]).getAllByRole('cell')[0]).toHaveTextContent('ONC');
    expect(within(rows[4]).getAllByRole('cell')[2]).toHaveTextContent('admin status');
    expect(within(rows[4]).getAllByRole('cell')[3]).toHaveTextContent('comment by admin');
  });
});
