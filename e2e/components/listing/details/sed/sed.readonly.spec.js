import Hooks from '../../../../utilities/hooks';
import SedComponent from './sed.po';

let hooks;
let sed;

beforeEach(async () => {
  hooks = new Hooks();
  sed = new SedComponent();
});

describe('the 2015 listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
    sed.sedHeader.scrollIntoView();
    sed.expandSed();
  });

  it('should show UCD process table and all criteria for UCS process under SED information', () => {
    expect(sed.ucdProcess.isDisplayed()).toBe(true);
    expect(sed.criteriaUcdCount()).toBeGreaterThan(5);
  });

  it('should show all testings tasks under SED information', () => {
    expect(sed.tasksTable.isDisplayed()).toBe(true);
    expect(sed.testingTasksCount()).toBeGreaterThan(40);
  });
});

describe('the 2014 listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/8490');
    hooks.waitForSpinnerToDisappear();
    sed.sedHeader.scrollIntoView();
    sed.expandSed();
  });

  it('should show UCD process table and all criteria for UCS process under SED information', () => {
    expect(sed.ucdProcess.isDisplayed()).toBe(true);
    expect(sed.criteriaUcdCount()).toBeGreaterThan(5);
  });

  it('should not show testings tasks under SED information', () => {
    expect(sed.tasksTable.isDisplayed()).toBe(false);
  });
});
