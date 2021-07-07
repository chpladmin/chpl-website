import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ComplaintsPage from '../../pages/surveillance/complaints/complaints.po';
import PaginationComponent from '../../components/pagination/pagination.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';

let hooks;
let loginComponent;
let page;
let pagination;
let complaintsComponent;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  page = new ComplaintsPage();
  pagination = new PaginationComponent();
  complaintsComponent = new ComplaintsComponent();
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

  it('should be able to delete complaint', () => {
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
    page.deleteComplaint(fields.acbId);
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    page.filter.addValue(fields.acbId);
    expect(pagination.pagination.isExisting()).toBe(false);
  });
});
