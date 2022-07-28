import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';

let hooks;
let login;
let action;
let complaintsComponent;
const ACB_ID_IDX = 4;
const FIRST_ROW = 1;

beforeEach(async () => {
  login = new LoginComponent();
  hooks = new Hooks();
  complaintsComponent = new ComplaintsComponent();
  action = new ActionBarComponent();
  hooks.open('#/surveillance/complaints');
  await hooks.waitForSpinnerToDisappear();
});

describe('As a ROLE_ACB user', () => {
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    login.logOut();
  });

  it('should not be able to add new complaint without required fields', () => {
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.saveComplaint();
    expect(complaintsComponent.fieldError('certification-body')).toBe('ONC-ACB is required');
    expect(complaintsComponent.fieldError('received-date')).toBe('Received Date is required');
    expect(complaintsComponent.fieldError('complainant-type')).toBe('Complainant Type is required');
    expect(complaintsComponent.fieldError('acb-complaint-id')).toBe('ONC-ACB Complaint ID is required');
    expect(complaintsComponent.fieldError('summary')).toBe('Complaint Summary is required');
  });

  it('should be able to add new complaint with only required fields', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Developer',
      summary: `Test Summary - ${timestamp}`,
    };
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.set(fields);
    complaintsComponent.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.filter.addValue(fields.acbId);
    browser.waitUntil(() => hooks.getTableRows().length-1 === 1);
    expect(hooks.getCellValue(FIRST_ROW, ACB_ID_IDX)).toBe(fields.acbId);
  });

  it('should be able to add new complaint with open surveillance for a 2015 listing', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Developer',
      summary: `Test Summary - ${timestamp}`,
    };
    const optionalFields = {
      oncId: `Test - ${timestamp}`,
      actions: `Test - ${timestamp}`,
      criterion: `170.315 (a)(4): Drug-Drug, Drug-Allergy Interaction Checks for CPOE`,
      listings: '15.04.04.2838.PARA.17.00.1.171228',
      surveillance: '15.04.04.2838.PARA.17.00.1.171228: SURV01'
    };
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.set(fields);
    complaintsComponent.setOptionalFields(optionalFields);
    complaintsComponent.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.filter.addValue(fields.acbId);
    browser.waitUntil(() => hooks.getTableRows().length-1 === 1);
    expect(hooks.getCellValue(FIRST_ROW, ACB_ID_IDX)).toBe(fields.acbId);
  });

  it('should be able to add new complaint for a 2015 listing with multiple surveillance activities', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Government Entity',
      summary: `Test Summary - ${timestamp}`,
    };
    const optionalFields = {
      oncId: `Test - ${timestamp}`,
      actions: `Test - ${timestamp}`,
      criterion: `170.315 (b)(9): Care Plan`,
      listings: '15.04.04.3010.Onco.28.01.1.181214',
      surveillance: '15.04.04.3010.Onco.28.01.1.181214: SURV01'
    };
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.set(fields);
    complaintsComponent.setOptionalFields(optionalFields);
    complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV02');
    complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV03');
    complaintsComponent.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.filter.addValue(fields.acbId);
    browser.waitUntil(() => hooks.getTableRows().length-1 === 1);
    expect(hooks.getCellValue(FIRST_ROW, ACB_ID_IDX)).toBe(fields.acbId);
  });

  it('should be able to add new complaint for multiple listings and surveillance activities', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Provider',
      summary: `Test Summary - ${timestamp}`,
    };
    const optionalFields = {
      oncId: `Test - ${timestamp}`,
      actions: `Test - ${timestamp}`,
      criterion: `170.315 (b)(9): Care Plan`,
      listings: '15.04.04.2838.PARA.17.00.1.171228',
      surveillance: '15.04.04.2838.PARA.17.00.1.171228: SURV01'
    };
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.set(fields);
    complaintsComponent.setOptionalFields(optionalFields);
    complaintsComponent.selectListing('15.04.04.3010.Onco.28.01.1.181214');
    complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV02');
    complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV03');
    complaintsComponent.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.filter.addValue(fields.acbId);
    browser.waitUntil(() => hooks.getTableRows().length-1 === 1);
    expect(hooks.getCellValue(FIRST_ROW, ACB_ID_IDX)).toBe(fields.acbId);
  });
});

describe('As a ROLE_ADMIN user', () => {
  beforeEach(() => {
    login.logIn('admin');
  });

  afterEach(() => {
    if(action.errors.length > 0){
      action.closeMessages();
    }
    login.logOut();
  });

  it('should be able to add new complaint for any ACBs- used retired ACB', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Surescripts LLC (Retired)',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Patient',
      summary: `Test Summary - ${timestamp}`,
    };
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.set(fields);
    complaintsComponent.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.filter.addValue(fields.acbId);
    browser.waitUntil(() => hooks.getTableRows().length-1 === 1);
    expect(hooks.getCellValue(FIRST_ROW, ACB_ID_IDX)).toBe(fields.acbId);
  });

  it('should not be able to add new complaint where listings is not same as ACB of the complaint', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Surescripts LLC (Retired)',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Patient',
      summary: `Test Summary - ${timestamp}`,
    };
    const optionalFields = {
      oncId: `Test - ${timestamp}`,
      actions: `Test - ${timestamp}`,
      criterion: `170.315 (b)(9): Care Plan`,
      listings: '15.04.04.3010.Onco.28.01.1.181214',
      surveillance: '15.04.04.3010.Onco.28.01.1.181214: SURV01'
    };
    complaintsComponent.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.set(fields);
    complaintsComponent.setOptionalFields(optionalFields);
    complaintsComponent.saveComplaint();
    expect(hooks.getErrors()).toContain('Certified product 15.04.04.3010.Onco.28.01.1.181214 does not have the same ONC-ACB as the complaint.');
  });
});

describe('As a ROLE_ONC user', () => {
  beforeEach(() => {
    login.logIn('onc');
  });

  afterEach(() => {
    login.logOut();
  });

  it('should not see add new complaint button', () => {
    expect(complaintsComponent.newComplaintButton.isDisplayed()).toBe(false);
  });

});