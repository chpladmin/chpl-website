import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {ChplEllipsis} from './ellipsis.jsx';

let container = null;

describe('the ChplEllipsis component', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('renders without shortening', () => {
    act(() => {
      render(<ChplEllipsis text='A string' />, container);
    });
    expect(container.textContent).toBe('A string');
  });

  it('renders while shortening', () => {
    let text = 'A string that is long';
    let length = 10;
    act(() => {
      render(<ChplEllipsis text={text} maxLength={length} />, container);
    });
    expect(container.textContent.startsWith('A string t')).toBe(true);
    expect(container.textContent.startsWith(text)).toBe(false);
  });

  it('renders while breaking on spaces', () => {
    let text = 'A string that is long';
    let length = 10;
    let wordBreak = true;
    act(() => {
      render(<ChplEllipsis text={text} maxLength={length} wordBoundaries={wordBreak} />, container);
    });
    expect(container.textContent.startsWith('A string')).toBe(true);
    expect(container.textContent.startsWith('A string t')).toBe(false);
    expect(container.textContent.startsWith(text)).toBe(false);
  });

  it('renders while giving up on breaking on spaces', () => {
    let text = 'Astringthatislong';
    let length = 10;
    let wordBreak = true;
    act(() => {
      render(<ChplEllipsis text={text} maxLength={length} wordBoundaries={wordBreak} />, container);
    });
    expect(container.textContent.startsWith('Astringtha')).toBe(true);
    expect(container.textContent.startsWith(text)).toBe(false);
  });
});
