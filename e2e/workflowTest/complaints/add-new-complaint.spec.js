import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ComplaintsPage from '../../pages/surveillance/complaints/complaints.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';

let hooks;
let login;
let page;
let complaints;

beforeEach(async () => {
  login = new LoginComponent();
  hooks = new Hooks();
  page = new ComplaintsPage();
  complaints = new ComplaintsComponent();
  hooks.open('#/surveillance/complaints');
  await hooks.waitForSpinnerToDisappear();
});

describe('As ROLE_ACB user', () => {
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    login.logOut();
  });

  it('should not be able to add new complaint without required fields', () => {
    page.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaints.saveComplaint();
    expect(complaints.fieldError('certification-body')).toBe('ONC-ACB is required');
    expect(complaints.fieldError('received-date')).toBe('Received Date is required');
    expect(complaints.fieldError('complainant-type')).toBe('Complainant Type is required');
    expect(complaints.fieldError('acb-complaint-id')).toBe('ONC-ACB Complaint ID is required');
    expect(complaints.fieldError('summary')).toBe('Complaint Summary is required');
  });

  it('should be able to add new complaint with required fields', () => {
    const timestamp = (new Date()).getTime();
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: `Test - ${timestamp}`,
      type: 'Developer',
      summary: `Test Summary - ${timestamp}`,
    };
    page.addNewComplaint();
    hooks.waitForSpinnerToDisappear();
    complaints.set(fields);
    complaints.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaints.filter.addValue(fields.acbId);
    expect(complaints.getcellValue(1, 4)).toBe(fields.acbId);
  });
});
