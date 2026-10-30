import reducer, {
  closeWidget,
  initialState,
  openWidget,
  toggleWidget,
} from './widget.slice';

const apply = (...actions) => actions.reduce(reducer, initialState).open;

describe('the open widget', () => {
  it('starts with neither widget open', () => {
    expect(apply()).toBeNull();
  });

  it('opens a widget, closing the other', () => {
    expect(apply(openWidget('compare'))).toBe('compare');
    expect(apply(openWidget('compare'), openWidget('cms'))).toBe('cms');
  });

  it('keeps a widget open when it is opened again', () => {
    expect(apply(openWidget('cms'), openWidget('cms'))).toBe('cms');
  });

  it('closes whichever widget is open', () => {
    expect(apply(openWidget('cms'), closeWidget())).toBeNull();
  });

  it('toggles a closed widget open, closing the other', () => {
    expect(apply(toggleWidget('cms'))).toBe('cms');
    expect(apply(openWidget('compare'), toggleWidget('cms'))).toBe('cms');
  });

  it('toggles an open widget closed', () => {
    expect(apply(openWidget('compare'), toggleWidget('compare'))).toBeNull();
  });
});
