import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { FlagContext } from '../../../../../shared/contexts';
import ChplTestStandardsEdit from './test-standards-edit';

const hocMock = {
  onChange: jest.fn(),
};

const flags = { optionalStandardsIsOn: false };

describe('the ChplTestStandardsEdit component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when rendering', () => {
    beforeEach(async () => {
      render(
        <FlagContext.Provider value={flags}>
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
          />
        </FlagContext.Provider>,
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

    it('should sort the available test standards by name', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Standard/i }));

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(within(options[0]).getByText('a name')).toBeInTheDocument();
        expect(within(options[1]).getByText('extra name')).toBeInTheDocument();
        expect(within(options[2]).getByText('fake name')).toBeInTheDocument();
      });
    });

    it('should remove selected items from the list available to add', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Standard/i }));

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(options.length).toBe(3);
      });
    });
  });

  describe('when selecting items', () => {
    beforeEach(async () => {
      render(
        <FlagContext.Provider value={flags}>
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
          />
        </FlagContext.Provider>,
      );
    });

    it('should add the option to the table', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Standard/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a name'));
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(3);
        expect(within(rows[0]).getByText('name 1')).toBeInTheDocument();
        expect(within(rows[1]).getByText('zz name')).toBeInTheDocument();
        expect(within(rows[2]).getByText('a name')).toBeInTheDocument();
      });
    });

    it('should allow cancellation', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Standard/i }));
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
      userEvent.click(screen.getByRole('button', { name: /Test Standard/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a name'));
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Add Item/i })).toBeNull();
      });
    });

    it('should call the callback', async () => {
      hocMock.onChange.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Test Standard/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a name'));
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        expect(hocMock.onChange).toHaveBeenCalledWith({
          data: [
            { testStandardId: 3, testStandardName: 'name 1' },
            { testStandardId: 2, testStandardName: 'zz name' },
            { testStandardId: 4, testStandardName: 'a name', key: expect.any(Number) },
          ],
          key: 'testStandards',
        });
      });
    });
  });

  describe('when removing items', () => {
    beforeEach(async () => {
      render(
        <FlagContext.Provider value={flags}>
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
          />
        </FlagContext.Provider>,
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
