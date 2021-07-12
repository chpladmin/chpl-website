import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplTestDataEdit from './test-data-edit';

const hocMock = {
  onChange: jest.fn(),
};

describe('the ChplTestDataEdit component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when rendering', () => {
    beforeEach(async () => {
      render(
        <ChplTestDataEdit
          testData={[{
            testData: { name: 'zz name', id: 2 },
            id: 2,
            version: 'ver z',
            alteration: 'alt z',
          }, {
            testData: { name: 'name 1', id: 3 },
            id: 3,
            version: 'ver n',
            alteration: 'alt n',
          }]}
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

    it('should sort the selected test data by name', async () => {
      const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');

      await waitFor(() => {
        expect(rows.length).toBe(2);
        expect(within(rows[0]).getByText('name 1')).toBeInTheDocument();
        expect(within(rows[0]).getByText('ver n')).toBeInTheDocument();
        expect(within(rows[0]).getByText('alt n')).toBeInTheDocument();
        expect(within(rows[1]).getByText('zz name')).toBeInTheDocument();
        expect(within(rows[1]).getByText('ver z')).toBeInTheDocument();
        expect(within(rows[1]).getByText('alt z')).toBeInTheDocument();
      });
    });

    it('should remove selected items from the list available to add', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Data Used/i }));

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(options.length).toBe(3);
      });
    });
  });

  describe('when selecting items', () => {
    beforeEach(async () => {
      render(
        <ChplTestDataEdit
          testData={[{
            testData: { name: 'zz name', id: 2 },
            id: 2,
            version: 'ver z',
            alteration: 'alt z',
          }, {
            testData: { name: 'name 1', id: 3 },
            id: 3,
            version: 'ver n',
            alteration: 'alt n',
          }]}
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

    it('should add the option to the table', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Data Used/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a name'));
      userEvent.type(screen.getByLabelText(/Version/i), 'new version');
      userEvent.type(screen.getByLabelText(/Alteration/i), 'new alteration');
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(3);
        expect(within(rows[0]).getByText('name 1')).toBeInTheDocument();
        expect(within(rows[1]).getByText('zz name')).toBeInTheDocument();
        expect(within(rows[2]).getByText('a name')).toBeInTheDocument();
        expect(within(rows[2]).getByText('new version')).toBeInTheDocument();
      });
    });

    it('should allow cancellation', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Data Used/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a name'));
      userEvent.click(screen.getByRole('button', { name: /Cancel adding item/i }));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(2);
        expect(within(rows[0]).getByText('name 1')).toBeInTheDocument();
        expect(within(rows[1]).getByText('zz name')).toBeInTheDocument();
      });
    });

    it('should remove the "add item" button when all options are selected', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Data Used/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a name'));
      userEvent.type(screen.getByLabelText(/Version/i), 'new version');
      userEvent.type(screen.getByLabelText(/Alteration/i), 'new alteration');
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Add Item/i })).toBeNull();
      });
    });

    it('should call the callback', async () => {
      hocMock.onChange.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Data Used/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a name'));
      userEvent.type(screen.getByLabelText(/Version/i), 'new version');
      userEvent.type(screen.getByLabelText(/Alteration/i), 'new alteration');
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        expect(hocMock.onChange).toHaveBeenCalledWith({
          data: [
            {
              id: 3, testData: { name: 'name 1', id: 3 }, version: 'ver n', alteration: 'alt n',
            },
            {
              id: 2, testData: { name: 'zz name', id: 2 }, version: 'ver z', alteration: 'alt z',
            },
            {
              key: expect.any(Number), testData: { name: 'a name', id: 4 }, version: 'new version', alteration: 'new alteration',
            },
          ],
          key: 'testDataUsed',
        });
      });
    });
  });

  describe('when removing items', () => {
    beforeEach(async () => {
      render(
        <ChplTestDataEdit
          testData={[{
            testData: { name: 'zz name', id: 2 },
            id: 2,
            version: 'ver z',
            alteration: 'alt z',
          }, {
            testData: { name: 'name 1', id: 3 },
            id: 3,
            version: 'ver n',
            alteration: 'alt n',
          }]}
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
            {
              id: 2, testData: { name: 'zz name', id: 2 }, version: 'ver z', alteration: 'alt z',
            },
          ],
          key: 'testDataUsed',
        });
      });
    });
  });
});
