import Hooks from '../../../../utilities/hooks';
import SedComponent from './sed.po';

let hooks; let sed;

describe('the Listing page', () => {
  beforeEach(async () => {
    hooks = new Hooks();
    sed = new SedComponent();
    hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should show UCD process table and all criteria for UCS process under SED information', () => {
    sed.sedHeader.scrollIntoView();
    sed.expandSed();
    expect(sed.ucdProcess.isDisplayed()).toBe(true);
    expect(sed.criteriaUcdCount()).toBeGreaterThan(5);
  });

  it('should show all testings tasks under SED information', () => {
    sed.sedHeader.scrollIntoView();
    sed.expandSed();
    expect(sed.tasksTable.isDisplayed()).toBe(true);
    expect(sed.testingTasksCount()).toBeGreaterThan(40);
  });
});
