import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ComplaintsPage from '../../pages/surveillance/complaints/complaints.po';

let hooks;
let loginComponent;
let page;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  page = new ComplaintsPage();
  hooks.open('#/surveillance/complaints');
  await hooks.waitForSpinnerToDisappear();
});

describe('As ROLE_ACB user', () => {
  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('should be able to search complaints by ONC-ACB Complaint Id', () => {
    // page.addNewComplaint();
    // page.saveComplaint();
    // expect(page.error.getText()).toHaveTextContaining('ONC-ACB is required');
    // expect(page.error.getText()).toHaveTextContaining('Complainant Type is required');
    // expect(page.error.getText()).toHaveTextContaining('Received Date is required');
    // expect(page.error.getText()).toHaveTextContaining('ONC-ACB Complaint ID is required');
    // expect(page.error.getText()).toHaveTextContaining('Complaint Summary is required');
  });

  it('should not be able to add new complaint without required fields', () => {
    page.addNewComplaint();
    page.saveComplaint();
    expect(page.error.getText()).toHaveTextContaining('ONC-ACB is required');
    expect(page.error.getText()).toHaveTextContaining('Complainant Type is required');
    expect(page.error.getText()).toHaveTextContaining('Received Date is required');
    expect(page.error.getText()).toHaveTextContaining('ONC-ACB Complaint ID is required');
    expect(page.error.getText()).toHaveTextContaining('Complaint Summary is required');
  });
  it('should be able to add new complaint with required fields', () => {
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: 'Test - 000000',
      type: 'Developer',
      summary: 'Test Summary',
    };
    page.addNewComplaint();
    page.set(fields);
    page.saveComplaint();
    hooks.waitForSpinnerToDisappear();
    page.filter.addValue(fields.acbId);
    expect(page.getcellValue(4)).toBe(fields.id);
  });
});
