import Hooks from '../../../../utilities/hooks';
import MeasuresComponent from './measures.po';

let hooks;
let measures;

beforeEach(async () => {
  hooks = new Hooks();
  measures = new MeasuresComponent();
});

describe('the 2015 Listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
  });

  it('should show measures', () => {
    measures.measuresHeader.scrollIntoView();
    measures.expandMeasures();
    expect(measures.measuresCount()).toBeGreaterThan(15);
  });
});
describe('the 2014 Listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/8490');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
  });

  it('should not show measures', () => {
    expect(measures.measuresHeader.isDisplayed()).toBe(false);
  });
});
