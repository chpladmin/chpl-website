import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplLoadingCards from './chpl-loading-cards';
import ChplSkeletonCard from './chpl-skeleton-card';

// Every card of the skeleton is a ChplSkeletonCard; find them by their content box
const cards = (container) => [...container.querySelectorAll('[aria-hidden="true"] > .MuiBox-root')].slice(1);
const skeletons = (element) => element.querySelectorAll('.MuiSkeleton-root');
const buttons = (element) => element.querySelectorAll('.MuiSkeleton-rectangular');

describe('ChplLoadingCards', () => {
  it('announces that results are loading, and hides its shapes from assistive technology', () => {
    render(<ChplLoadingCards />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading results');
    screen.getByRole('status').querySelectorAll('.MuiSkeleton-root').forEach((skeleton) => {
      expect(skeleton.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });

  it('draws the number of cards asked for', () => {
    const { container } = render(<ChplLoadingCards cards={3} />);
    expect(cards(container)).toHaveLength(3);
  });

  it('keeps the listing search card shape by default: two rows of three and two buttons', () => {
    const { container } = render(<ChplLoadingCards cards={1} controls={0} />);
    const card = cards(container)[0];
    // a label and a value per field, then the buttons
    expect(skeletons(card)).toHaveLength((6 * 2) + 2);
    expect(buttons(card)).toHaveLength(2);
  });

  it('draws one row per field group, with the fields each asks for', () => {
    const { container } = render(<ChplLoadingCards cards={1} controls={0} actions={0} fieldGroups={[3, 3, 1]} />);
    expect(skeletons(cards(container)[0])).toHaveLength(7 * 2);
  });

  it('draws as many value lines as a tall field asks for', () => {
    const { container } = render(<ChplLoadingCards cards={1} controls={0} actions={0} fieldGroups={[[{ lines: 3 }]]} />);
    expect(skeletons(cards(container)[0])).toHaveLength(1 + 3);
  });

  it('adds the title row for cards that have one', () => {
    const { container } = render(<ChplLoadingCards cards={1} controls={0} actions={0} fieldGroups={[2]} title />);
    expect(skeletons(cards(container)[0])).toHaveLength(2 + (2 * 2));
  });

  it('draws no actions column for cards without buttons', () => {
    const { container } = render(<ChplLoadingCards cards={1} controls={0} actions={0} />);
    expect(buttons(cards(container)[0])).toHaveLength(0);
  });

  it('draws the controls beside the result count that the page has', () => {
    const { container: none } = render(<ChplLoadingCards cards={0} controls={0} />);
    const { container: sortOnly } = render(<ChplLoadingCards cards={0} controls={1} />);
    expect(buttons(none)).toHaveLength(0);
    expect(buttons(sortOnly)).toHaveLength(1);
  });
});

describe('ChplSkeletonCard', () => {
  it('frames its content without being a real MUI Card', () => {
    const { container } = render(<ChplSkeletonCard><span>content</span></ChplSkeletonCard>);
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(container.querySelector('.MuiCard-root')).toBeNull();
    expect(container.querySelector('.MuiPaper-root')).toBeNull();
  });
});
