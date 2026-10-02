import React from 'react';
import { render } from '@testing-library/react';

import ChplSearchResultCard from './chpl-search-result-card';

// Field and title values can be any node, so the card must not wrap them in a
// <p>: block content such as the <dl> the API documentation page passes would
// be invalid there, and React logs a DOM nesting error for it.

const isNestingError = (args) => args.some((arg) => typeof arg === 'string'
  && /validateDOMNesting|cannot (appear as|be) a descendant of/.test(arg));

describe('the search result card', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('renders block content in field and title values without invalid nesting', () => {
    const { container } = render(
      <ChplSearchResultCard
        cardTitle="Listing"
        cardTitleValue={<div>Block title</div>}
        fieldGroups={[
          [
            {
              label: 'API Documentation',
              value: (
                <dl>
                  <dt>170.315 (g)(10)</dt>
                  <dd>https://example.com</dd>
                </dl>
              ),
            },
            { label: 'Product', value: 'A product' },
          ],
        ]}
      />,
    );

    expect(container.querySelector('dl')).not.toBeNull();
    expect(container.querySelectorAll('p dl, p div, p p')).toHaveLength(0);
    expect(consoleError.mock.calls.filter(isNestingError)).toHaveLength(0);
  });

  it('still falls back when a field has no value', () => {
    const { getByText } = render(
      <ChplSearchResultCard
        fieldGroups={[[
          { label: 'Missing', value: undefined, fallback: 'None' },
          { label: 'Also missing' },
        ]]}
      />,
    );

    expect(getByText('None')).toBeInTheDocument();
    expect(getByText('N/A')).toBeInTheDocument();
  });
});
