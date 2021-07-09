import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import PaginationComponent from '../../components/pagination/pagination.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';

let hooks;
let login;
let pagination;
let complaintsComponent;

beforeEach(async () => {
  login = new LoginComponent();
  hooks = new Hooks();
  pagination = new PaginationComponent();
  complaintsComponent = new ComplaintsComponent();
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

  it('should be able to delete complaint', () => {
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
    complaintsComponent.deleteComplaint(fields.acbId);
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    complaintsComponent.filter.addValue(fields.acbId);
    expect(pagination.pagination.isExisting()).toBe(false);
  });
});
