import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import ChplReliedUponSoftwareEdit from './relied-upon-software-edit';

const hocMock = {
  onChange: jest.fn(),
};

describe('the ChplReliedUponSoftwareEdit component', () => {
  beforeEach(async () => {
    render(
      <ChplReliedUponSoftwareEdit
        software={[{
          name: 'zz name',
          version: 'version 2',
          grouping: 'group a',
          id: 1,
        }, {
          certifiedProductNumber: 'CHPL Product Number',
          grouping: 'group b',
          id: 2,
        }]}
        onChange={hocMock.onChange}
      />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  describe('when rendering', () => {
    it('should render the relied upon software', async () => {
      const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');

      await waitFor(() => {
        expect(rows.length).toBe(2);
        expect(within(rows[0]).getByText('zz name')).toBeInTheDocument();
        expect(within(rows[0]).getByText('version 2')).toBeInTheDocument();
        expect(within(rows[0]).getByText('group a')).toBeInTheDocument();
        expect(within(rows[1]).getByText('CHPL Product Number')).toBeInTheDocument();
        expect(within(rows[1]).getByText('group b')).toBeInTheDocument();
      });
    });
  });

  describe('when adding items', () => {
    it('should add the software to the table', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.type(screen.getByLabelText(/Name/i), 'new name');
      userEvent.type(screen.getByLabelText(/Version/i), 'new version');
      userEvent.type(screen.getByLabelText(/Grouping/i), 'new group');
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(3);
        expect(within(rows[2]).getByText('new name')).toBeInTheDocument();
        expect(within(rows[2]).getByText('new version')).toBeInTheDocument();
        expect(within(rows[2]).getByText('new group')).toBeInTheDocument();
      });
    });

    it('should allow cancellation', async () => {
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.type(screen.getByLabelText(/Name/i), 'new name');
      userEvent.type(screen.getByLabelText(/Version/i), 'new version');
      userEvent.type(screen.getByLabelText(/Grouping/i), 'new group');
      userEvent.click(screen.getByRole('button', { name: /Cancel adding item/i }));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(2);
        expect(within(rows[0]).getByText('zz name')).toBeInTheDocument();
        expect(within(rows[0]).getByText('version 2')).toBeInTheDocument();
        expect(within(rows[0]).getByText('group a')).toBeInTheDocument();
        expect(within(rows[1]).getByText('CHPL Product Number')).toBeInTheDocument();
        expect(within(rows[1]).getByText('group b')).toBeInTheDocument();
      });
    });

    it('should call the callback', async () => {
      hocMock.onChange.mockClear();
      userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
      userEvent.type(screen.getByLabelText(/Name/i), 'new name');
      userEvent.type(screen.getByLabelText(/Version/i), 'new version');
      userEvent.type(screen.getByLabelText(/Grouping/i), 'new group');
      userEvent.click(screen.getByRole('button', { name: /Confirm adding item/i }));

      await waitFor(() => {
        expect(hocMock.onChange).toHaveBeenCalledWith({
          data: [{
            grouping: 'group a',
            name: 'zz name',
            version: 'version 2',
            id: 1,
          }, {
            certifiedProductNumber: 'CHPL Product Number',
            grouping: 'group b',
            id: 2,
          }, {
            certifiedProductNumber: null,
            grouping: 'new group',
            key: expect.any(Number),
            name: 'new name',
            version: 'new version',
          }],
          key: 'additionalSoftware',
        });
      });
    });
  });

  describe('when removing items', () => {
    it('should remove the option from the table', async () => {
      userEvent.click(within(within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')[0]).getByRole('button'));

      await waitFor(() => {
        const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');
        expect(rows.length).toBe(1);
        expect(within(rows[0]).getByText('CHPL Product Number')).toBeInTheDocument();
        expect(within(rows[0]).getByText('group b')).toBeInTheDocument();
      });
    });

    it('should call the callback', async () => {
      hocMock.onChange.mockClear();
      userEvent.click(within(within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')[0]).getByRole('button'));

      await waitFor(() => {
        expect(hocMock.onChange).toHaveBeenCalledWith({
          data: [{
            certifiedProductNumber: 'CHPL Product Number',
            grouping: 'group b',
            id: 2,
          }],
          key: 'additionalSoftware',
        });
      });
    });
  });
});
