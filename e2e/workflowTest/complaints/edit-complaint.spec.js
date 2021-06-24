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

describe('As ROLE_ACB user - when editing complaint', () => {
  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('should display correct error messages regarding received and closed date', () => {
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: 'Test - 111111',
      type: 'Developer',
      summary: 'Test Summary',
    };
    page.addNewComplaint();
    page.set(fields);
    page.saveComplaint();
    hooks.waitForSpinnerToDisappear();
    page.editComplaint(fields.acbId);
    page.closedDate.addValue('04/23/2021');
    page.saveComplaint();
    expect(page.error.getText()).toBe('ADD TEXT HERE');
    page.closedDate.addValue('04/23/2025');
    page.saveComplaint();
    expect(page.error.getText()).toBe('ADD TEXT HERE');
  });
});
