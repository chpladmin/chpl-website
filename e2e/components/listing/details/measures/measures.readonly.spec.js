import Hooks from '../../../../utilities/hooks';
import MeasuresComponent from './measures.po';

let hooks; let measures;

describe('the Listing page', () => {
  beforeEach(async () => {
    hooks = new Hooks();
    measures = new MeasuresComponent();
    hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should show measures', () => {
    measures.measuresHeader.scrollIntoView();
    measures.expandMeasures();
    expect(measures.measuresCount()).toBeGreaterThan(15);
  });
});
