import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplSvapsEdit from './svaps-edit';

const hocMock = {
  onChange: jest.fn(),
};

describe('the ChplSvapsEdit component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when rendering', () => {
    beforeEach(async () => {
      render(
        <ChplSvapsEdit
          svaps={[{
            approvedStandardVersion: 'zz version',
            id: 9,
            regulatoryTextCitation: 'zz citation',
            svapId: 2,
          }, {
            approvedStandardVersion: 'version 1',
            id: 12,
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }]}
          options={[{
            approvedStandardVersion: 'zz version',
            regulatoryTextCitation: 'zz citation',
            svapId: 2,
          }, {
            approvedStandardVersion: 'version 1',
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }, {
            approvedStandardVersion: 'a name',
            regulatoryTextCitation: 'a citation',
            svapId: 4,
          }]}
          onChange={hocMock.onChange}
        />,
      );
    });

    it('should have the selected svaps in the table', async () => {
      const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');

      await waitFor(() => {
        expect(rows.length).toBe(2);
        expect(within(rows[0]).getByText('zz version')).toBeInTheDocument();
        expect(within(rows[0]).getByText('zz citation')).toBeInTheDocument();
        expect(within(rows[1]).getByText('version 1')).toBeInTheDocument();
        expect(within(rows[1]).getByText('citation 1')).toBeInTheDocument();
      });
    });

    it('should remove selected items from the list available to add', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Standards Version Advancement Process/i }));

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(options.length).toBe(1);
      });
    });
  });

  describe('when selecting items', () => {
    beforeEach(async () => {
      render(
        <ChplSvapsEdit
          svaps={[{
            approvedStandardVersion: 'zz version',
            id: 9,
            regulatoryTextCitation: 'zz citation',
            svapId: 2,
          }, {
            approvedStandardVersion: 'version 1',
            id: 12,
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }]}
          options={[{
            approvedStandardVersion: 'zz version',
            regulatoryTextCitation: 'zz citation',
            svapId: 2,
          }, {
            approvedStandardVersion: 'version 1',
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }, {
            approvedStandardVersion: 'a name',
            regulatoryTextCitation: 'a citation',
            svapId: 4,
          }]}
          onChange={hocMock.onChange}
        />,
      );
    });

    it('should add the option to the table', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Standards Version Advancement Process/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a citation'));
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(3);
        expect(within(rows[0]).getByText('zz version')).toBeInTheDocument();
        expect(within(rows[0]).getByText('zz citation')).toBeInTheDocument();
        expect(within(rows[1]).getByText('version 1')).toBeInTheDocument();
        expect(within(rows[1]).getByText('citation 1')).toBeInTheDocument();
        expect(within(rows[2]).getByText('a citation')).toBeInTheDocument();
      });
    });

    it('should allow cancellation', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Standards Version Advancement Process/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a citation'));
      userEvent.click(screen.getByRole('button', { name: /Cancel adding item/i }));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(2);
        expect(within(rows[0]).getByText('zz version')).toBeInTheDocument();
        expect(within(rows[0]).getByText('zz citation')).toBeInTheDocument();
        expect(within(rows[1]).getByText('version 1')).toBeInTheDocument();
        expect(within(rows[1]).getByText('citation 1')).toBeInTheDocument();
      });
    });

    it('should remove the "add item" button when all options are selected', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Standards Version Advancement Process/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a citation'));
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Add Item/i })).toBeNull();
      });
    });

    it('should call the callback', async () => {
      hocMock.onChange.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.click(screen.getByRole('button', { name: /Standards Version Advancement Process/i }));
      userEvent.click(within(screen.getByRole('listbox')).getByText('a citation'));
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        expect(hocMock.onChange).toHaveBeenCalledWith({
          data: [{
            approvedStandardVersion: 'zz version',
            id: 9,
            regulatoryTextCitation: 'zz citation',
            svapId: 2,
          }, {
            approvedStandardVersion: 'version 1',
            id: 12,
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }, {
            approvedStandardVersion: 'a name',
            key: expect.any(Number),
            regulatoryTextCitation: 'a citation',
            svapId: 4,
          }],
          key: 'svaps',
        });
      });
    });
  });

  describe('when removing items', () => {
    beforeEach(async () => {
      render(
        <ChplSvapsEdit
          svaps={[{
            approvedStandardVersion: 'zz version',
            id: 9,
            regulatoryTextCitation: 'zz citation',
            svapId: 2,
          }, {
            approvedStandardVersion: 'version 1',
            id: 12,
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }]}
          options={[{
            approvedStandardVersion: 'zz version',
            regulatoryTextCitation: 'zz citation',
            svapId: 2,
          }, {
            approvedStandardVersion: 'version 1',
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }, {
            approvedStandardVersion: 'a name',
            regulatoryTextCitation: 'a citation',
            svapId: 4,
          }]}
          onChange={hocMock.onChange}
        />,
      );
    });

    it('should remove the option from the table', async () => {
      userEvent.click(within(within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')[0]).getByRole('button'));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(1);
        expect(within(rows[0]).getByText('version 1')).toBeInTheDocument();
      });
    });

    it('should call the callback', async () => {
      hocMock.onChange.mockClear();
      userEvent.click(within(within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')[0]).getByRole('button'));

      await waitFor(() => {
        expect(hocMock.onChange).toHaveBeenCalledWith({
          data: [{
            approvedStandardVersion: 'version 1',
            id: 12,
            regulatoryTextCitation: 'citation 1',
            svapId: 3,
          }],
          key: 'svaps',
        });
      });
    });
  });
});
