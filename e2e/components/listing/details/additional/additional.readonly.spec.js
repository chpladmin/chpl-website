import Hooks from '../../../../utilities/hooks';
import AdditionalComponent from './additional.po';

let additional;
let hooks;

beforeEach(() => {
  hooks = new Hooks();
  additional = new AdditionalComponent();
});
describe('the Listing page for listing with ICS 0', () => {
  beforeEach(() => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
  });

  it('should not display ICS relationship button under additional information', () => {
    additional.additionalHeader.scrollIntoView();
    additional.expandAdditional();
    expect(additional.icsButton.isDisplayed()).toBe(false);
  });
});

