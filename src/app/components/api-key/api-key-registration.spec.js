import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {ChplApiKeyRegistration} from './api-key-registration.jsx';

let container = null;

describe('the ChplApiKeyRegistration component', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  describe('when rendering for the first time', () => {
    beforeEach(() => {
      act(() => {
        render(<ChplApiKeyRegistration />, container);
      });
    });

    it('should have empty string for email in state', () => {
      container.
    })
  });


  it('renders without shortening', () => {
    act(() => {
      render(<ChplEllipsis text='A string' />, container);
    });
    expect(container.textContent).toBe('A string');
  });
});