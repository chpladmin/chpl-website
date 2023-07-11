import Hooks from '../../../../utilities/hooks';
import InformationComponent from './information.po';

let information;
let hooks;

beforeEach(() => {
  hooks = new Hooks();
  information = new InformationComponent();
});
describe('the 2015 Listing page', () => {
  beforeEach(() => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
  });

  it('should display developer information, address, contact and website link', () => {
    expect(information.getInformation('developer').isDisplayed()).toBe(true);
    expect(information.address.isDisplayed()).toBe(true);
    expect(information.contact.isDisplayed()).toBe(true);
    expect(information.link.getAttribute('href')).toContain('http://www');
  });
  it('should display edition as 2015', () => {
    expect(information.getInformation('certification-edition').getText()).toContain('2015');
  });
  it('should display status as active', () => {
    expect(information.getInformation('certification-status').getText()).toContain('Active');
  });
  it('should display ACB information', () => {
    expect(information.getInformation('onc-authorized-certification-body').getText()).toContain('Drummond Group');
  });
  it('should display ATL information', () => {
    expect(information.getInformation('onc-accredited-testing-laboratory').getText()).toContain('Drummond Group');
  });
  it('should not display practice type', () => {
    expect(information.getInformation('practice-type').isDisplayed()).toBe(false);
  });
  it('should not display classification type', () => {
    expect(information.getInformation('classification-type').isDisplayed()).toBe(false);
  });
  it('should display mandatory disclosures URL', () => {
    expect(information.getInformation('mandatory-disclosures').isDisplayed()).toBe(true);
  });
});

describe('the 2014 Listing page', () => {
  beforeEach(() => {
    hooks.open('#/listing/8490');
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
  });

  it('should display developer information, address, contact and website link', () => {
    expect(information.getInformation('developer').isDisplayed()).toBe(true);
    expect(information.address.isDisplayed()).toBe(true);
    expect(information.contact.isDisplayed()).toBe(true);
    expect(information.link.getAttribute('href')).toContain('https://www');
  });
  it('should display version information', () => {
    expect(information.getInformation('version').isDisplayed()).toBe(true);
  });
  it('should display edition as 2014', () => {
    expect(information.getInformation('certification-edition').getText()).toContain('2014');
  });
  it('should display status as retired', () => {
    expect(information.getInformation('certification-status').getText()).toContain('Retired');
  });
  it('should display practice type', () => {
    expect(information.getInformation('practice-type').isDisplayed()).toBe(true);
  });
  it('should display classification type', () => {
    expect(information.getInformation('classification-type').isDisplayed()).toBe(true);
  });
  xit('should display ACB information', () => {
    expect(information.getInformation('onc-authorized-certification-body').getText()).toContain('Drummond Group');
  });
  xit('should display ATL information', () => {
    expect(information.getInformation('onc-accredited-testing-laboratory').isDisplayed()).toBe(true);
  });
  xit('should display mandatory disclosures URL', () => {
    expect(information.getInformation('mandatory-disclosures').isDisplayed()).toBe(true);
  });
});

