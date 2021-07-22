import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';

let hooks;
let login;
let complaintsComponent;
const ACB_ID_IDX = 4;
const FIRST_ROW = 1;

beforeEach(async () => {
  login = new LoginComponent();
  hooks = new Hooks();
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

  it('should be able to add new complaint with required fields', () => {
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
    expect(hooks.getCellValue(FIRST_ROW, ACB_ID_IDX)).toBe(fields.acbId);
  });
});
