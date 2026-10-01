import React from 'react';
import { render, screen } from '@testing-library/react';

import ChplLink from './chpl-link';

// The wrapper around an external link is a flex container so the disclaimer
// icon sits beside the text. A block-level flex container starts on its own
// line, so an external link marked `inline` has to use inline-flex instead.

const wrapperOf = (text) => screen.getByText(text).closest('span');

describe('ChplLink', () => {
  it('keeps an inline external link in the flow of the surrounding text', () => {
    render(
      <p>
        Found in the
        {' '}
        <ChplLink href="https://example.com" text="release notes" inline />
      </p>,
    );

    expect(getComputedStyle(wrapperOf('release notes')).display).toBe('inline-flex');
    expect(screen.getByTitle('Web Site Disclaimers')).toBeInTheDocument();
  });

  it('leaves a non-inline external link as a block-level flex container', () => {
    render(<ChplLink href="https://example.com" text="standalone" />);

    expect(getComputedStyle(wrapperOf('standalone')).display).toBe('flex');
  });

  it('renders an inline internal link as a bare anchor', () => {
    render(<ChplLink href="#/search" text="search" external={false} inline />);

    expect(screen.getByText('search').tagName).toBe('A');
    expect(screen.getByText('search').closest('span')).toBeNull();
    expect(screen.queryByTitle('Web Site Disclaimers')).toBeNull();
  });
});
