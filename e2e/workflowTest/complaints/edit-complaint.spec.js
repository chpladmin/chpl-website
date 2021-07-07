import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ComplaintsPage from '../../pages/surveillance/complaints/complaints.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';

let hooks;
let loginComponent;
let page;
let complaintsComponent;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  page = new ComplaintsPage();
  complaintsComponent = new ComplaintsComponent();
  hooks.open('#/surveillance/complaints');
  await hooks.waitForSpinnerToDisappear();
});

describe('As ROLE_ACB user - when editing complaint', () => {
  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
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
    complaintsComponent.set(fields);
    complaintsComponent.saveComplaint();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    page.editComplaint(fields.acbId);
    complaintsComponent.closedDate.addValue('01/23/2021');
    complaintsComponent.saveComplaint();
    expect(complaintsComponent.fieldError('closed-date')).toBe('Closed Date must be after Received Date');
    complaintsComponent.closedDate.addValue('04/23/2025');
    complaintsComponent.saveComplaint();
    expect(complaintsComponent.fieldError('closed-date')).toBe('Closed Date must not be in the future');
  });
});
