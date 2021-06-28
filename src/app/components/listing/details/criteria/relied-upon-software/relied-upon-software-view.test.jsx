import React from 'react';
import {
  cleanup, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import ChplReliedUponSoftwareView from './relied-upon-software-view';

describe('the ChplReliedUponSoftwareView component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('with a single group of software', () => {
    it('should render one piece of non-CHPL software without version', async () => {
      render(
        <ChplReliedUponSoftwareView
          sw={[{
            name: 'name',
            grouping: 'a',
          }]}
        />,
      );
      const items = within(screen.getByRole('list')).getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(1);
        expect(within(items[0]).getByText('name')).toBeInTheDocument();
      });
    });

    it('should render one piece of non-CHPL software with version', async () => {
      render(
        <ChplReliedUponSoftwareView
          sw={[{
            name: 'name',
            version: 'a version',
            grouping: 'a',
          }]}
        />,
      );
      const items = within(screen.getByRole('list')).getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(1);
        expect(within(items[0]).getByText('name (Version a version)')).toBeInTheDocument();
      });
    });

    it('should render one piece of non-CHPL software with a special version', async () => {
      render(
        <ChplReliedUponSoftwareView
          sw={[{
            name: 'name',
            version: '-1',
            grouping: 'a',
          }]}
        />,
      );
      const items = within(screen.getByRole('list')).getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(1);
        expect(within(items[0]).getByText('name')).toBeInTheDocument();
      });
    });

    it('should render one piece of valid CHPL software', async () => {
      render(
        <ChplReliedUponSoftwareView
          sw={[{
            certifiedProductId: 3,
            certifiedProductNumber: 'CHPL product number',
          }]}
        />,
      );
      const items = within(screen.getByRole('list')).getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(1);
        expect(within(items[0]).getByText('CHPL product number')).toBeInTheDocument();
        expect(within(items[0]).getByText('CHPL product number').closest('a')).toHaveAttribute('href', '#/listing/3');
      });
    });

    it('should render one piece of invalid CHPL software', async () => {
      render(
        <ChplReliedUponSoftwareView
          sw={[{
            certifiedProductNumber: 'CHPL product number',
          }]}
        />,
      );
      const items = within(screen.getByRole('list')).getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(1);
        expect(within(items[0]).getByText('CHPL product number')).toBeInTheDocument();
        expect(within(items[0]).getByText('CHPL product number').closest('span')).toHaveAttribute('class', 'data-item--invalid');
        expect(within(items[0]).getByText('(this CHPL Product Number is invalid)')).toBeInTheDocument();
      });
    });

    it('should render two pieces of software showing "OR"', async () => {
      render(
        <ChplReliedUponSoftwareView
          sw={[{
            name: 'name',
            grouping: 'a',
          }, {
            name: 'sw 2',
            grouping: 'a',
          }]}
        />,
      );
      const parent = within(screen.getAllByRole('list')[0]).getAllByRole('listitem');
      const items = within(screen.getAllByRole('list')[1]).getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(2);
        expect(within(parent[0]).getByText('One of')).toBeInTheDocument();
        expect(within(items[0]).getByText('name OR')).toBeInTheDocument();
        expect(within(items[1]).getByText('sw 2')).toBeInTheDocument();
      });
    });
  });

  describe('with two groups of software', () => {
    it('should render two pieces of software showing "AND"', async () => {
      render(
        <ChplReliedUponSoftwareView
          sw={[{
            name: 'name',
            grouping: 'a',
          }, {
            name: 'sw 2',
            grouping: 'b',
          }]}
        />,
      );
      const items = within(screen.getByRole('list')).getAllByRole('listitem');

      await waitFor(() => {
        expect(items.length).toBe(2);
        expect(within(items[0]).getByText('name AND')).toBeInTheDocument();
        expect(within(items[1]).getByText('sw 2')).toBeInTheDocument();
      });
    });
  });
});
