import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplSortControls from './chpl-sort-controls';

const sortOptions = [
  { property: 'developer', text: 'Developer' },
  { property: 'certificationDate', text: 'Certification Date', reverseDefault: true },
];

// Renders the controls as a search page does: the page holds the sort, and says
// whether its results are updating
const renderControls = () => {
  const onSort = jest.fn();
  const controls = ({ order = 'asc', isUpdating = false } = {}) => (
    <ChplSortControls
      sortOptions={sortOptions}
      orderBy="developer"
      order={order}
      onSort={onSort}
      isUpdating={isUpdating}
    />
  );
  const view = render(controls());
  return { onSort, update: (props) => view.rerender(controls(props)) };
};

const directionButton = () => screen.getByRole('button', { name: /^Sort (de|a)scending$/ });
const spinner = () => screen.queryByRole('progressbar', { name: 'Sorting results' });

describe('the sort controls', () => {
  describe('as before', () => {
    it('toggles the direction of the current sort', () => {
      const { onSort } = renderControls();
      fireEvent.click(directionButton());

      expect(onSort).toHaveBeenCalledWith('developer', 'desc');
    });

    it('sorts a newly chosen field in its default direction', () => {
      const { onSort } = renderControls();
      fireEvent.click(screen.getByRole('button', { name: 'Developer' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Certification Date' }));

      expect(onSort).toHaveBeenCalledWith('certificationDate', 'desc');
    });

    it('shows no spinner and stays enabled when nothing is updating', () => {
      renderControls();

      expect(spinner()).not.toBeInTheDocument();
      expect(directionButton()).toBeEnabled();
    });
  });

  describe('while the results update', () => {
    it('shows a spinner after a re-sort', () => {
      const { update } = renderControls();
      fireEvent.click(directionButton());
      update({ order: 'desc', isUpdating: true });

      expect(spinner()).toBeInTheDocument();
    });

    it('stays usable, so the direction can be flipped back straight away', () => {
      const { onSort, update } = renderControls();
      fireEvent.click(directionButton());
      update({ order: 'desc', isUpdating: true });
      fireEvent.click(directionButton());

      expect(onSort).toHaveBeenLastCalledWith('developer', 'asc');
    });

    it('keeps the spinner if the page passes the new sort down before it starts updating', () => {
      const { update } = renderControls();
      fireEvent.click(directionButton());
      update({ order: 'asc', isUpdating: false });
      update({ order: 'desc', isUpdating: true });

      expect(spinner()).toBeInTheDocument();
    });

    it('drops the spinner once the re-sorted results arrive', () => {
      const { update } = renderControls();
      fireEvent.click(directionButton());
      update({ order: 'desc', isUpdating: true });
      update({ order: 'desc', isUpdating: false });

      expect(spinner()).not.toBeInTheDocument();
    });

    it('shows no spinner for an update it did not ask for, such as a change of page', () => {
      const { update } = renderControls();
      update({ isUpdating: true });

      expect(spinner()).not.toBeInTheDocument();
    });

    it('forgets a re-sort answered from the cache, so a later change of page shows no spinner', () => {
      const { update } = renderControls();
      fireEvent.click(directionButton());
      update({ order: 'desc', isUpdating: false });
      update({ order: 'desc', isUpdating: true });

      expect(spinner()).not.toBeInTheDocument();
    });
  });
});
