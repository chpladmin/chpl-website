import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ComplaintsPage from '../../pages/surveillance/complaints/complaints.po';
import PaginationComponent from '../../components/pagination/pagination.po';

let hooks;
let loginComponent;
let page;
let pagination;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  page = new ComplaintsPage();
  pagination = new PaginationComponent();
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
    const fields = {
      body: 'Drummond Group',
      receivedDate: '06/23/2021',
      acbId: 'Test - 111112',
      type: 'Developer',
      summary: 'Test Summary',
    };
    page.addNewComplaint();
    page.set(fields);
    page.saveComplaint();
    hooks.waitForSpinnerToDisappear();
    page.deleteComplaint(fields.acbId);
    page.delete.click();
    hooks.waitForSpinnerToDisappear();
    page.filter.addValue(fields.acbId);
    expect(pagination.pagination.isExisting()).toBe(false);
  });
});
