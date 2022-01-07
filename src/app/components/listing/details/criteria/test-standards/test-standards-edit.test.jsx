import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplTestStandardsEdit from './test-standards-edit';

const hocMock = {
  onChange: jest.fn(),
};

describe('the ChplTestStandardsEdit component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when rendering', () => {
    beforeEach(async () => {
      render(
        <ChplTestStandardsEdit
          testStandards={[
            { testStandardName: 'zz name', testStandardId: 2 },
            { testStandardName: 'name 1', testStandardId: 3 },
          ]}
          options={[
            { name: 'zz name', id: 2 },
            { name: 'extra name', id: 6 },
            { name: 'name 1', id: 3 },
            { name: 'fake name', id: 5 },
            { name: 'a name', id: 4 },
          ]}
          onChange={hocMock.onChange}
        />,
      );
    });

    it('should sort the selected test standards by name', async () => {
      const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');

      await waitFor(() => {
        expect(rows.length).toBe(2);
        expect(within(rows[0]).getByText('name 1')).toBeInTheDocument();
        expect(within(rows[1]).getByText('zz name')).toBeInTheDocument();
      });
    });
  });

  describe('when removing items', () => {
    beforeEach(async () => {
      render(
        <ChplTestStandardsEdit
          testStandards={[
            { testStandardName: 'zz name', testStandardId: 2 },
            { testStandardName: 'name 1', testStandardId: 3 },
          ]}
          options={[
            { name: 'zz name', id: 2 },
            { name: 'name 1', id: 3 },
            { name: 'a name', id: 4 },
          ]}
          onChange={hocMock.onChange}
        />,
      );
    });

    it('should remove the option from the table', async () => {
      userEvent.click(within(within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')[0]).getByRole('button'));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(1);
        expect(within(rows[0]).getByText('zz name')).toBeInTheDocument();
      });
    });

    it('should call the callback', async () => {
      hocMock.onChange.mockClear();
      userEvent.click(within(within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')[0]).getByRole('button'));

      await waitFor(() => {
        expect(hocMock.onChange).toHaveBeenCalledWith({
          data: [
            { testStandardId: 2, testStandardName: 'zz name' },
          ],
          key: 'testStandards',
        });
      });
    });
  });
});
