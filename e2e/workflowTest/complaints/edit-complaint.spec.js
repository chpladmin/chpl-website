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

describe('As ROLE_ACB user - when editing complaint', () => {
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    login.logOut();
  });

  it('should display correct error messages regarding received and closed date', () => {
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
    complaints.editComplaint(fields.acbId);
    complaints.closedDate.addValue('01/23/2021');
    complaints.saveComplaint();
    expect(complaints.fieldError('closed-date')).toBe('Closed Date must be after Received Date');
    complaints.closedDate.addValue('04/23/2025');
    complaints.saveComplaint();
    expect(complaints.fieldError('closed-date')).toBe('Closed Date must not be in the future');
  });
});
