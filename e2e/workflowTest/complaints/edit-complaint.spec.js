import LoginComponent from '../../components/login/login.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';
import {
  getCellValue,
  open,
  waitForSpinnerToAppear,
  waitForSpinnerToDisappear,
} from '../../utilities/hooks.async';

let login;
let complaintsComponent;
const STATUS_IDX = 2;
const FIRST_ROW = 1;

beforeEach(async () => {
  login = new LoginComponent();
  complaintsComponent = new ComplaintsComponent();
  await open('#/surveillance/complaints');
  await waitForSpinnerToDisappear();
});

describe('when editing complaints', () => {
  describe('as a ROLE_ACB user', () => {
    beforeEach(async () => {
      await login.logIn('drummond');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should display correct error messages regarding received and closed date', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Drummond Group',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Developer',
        summary: `Test Summary - ${timestamp}`,
      };
      await complaintsComponent.addNewComplaint();
      await waitForSpinnerToDisappear();
      await complaintsComponent.set(fields);
      await complaintsComponent.saveComplaint();
      await waitForSpinnerToDisappear();
      await complaintsComponent.editComplaint(fields.acbId);
      await (await complaintsComponent.closedDate).addValue(['23', 'Jan', 'Tab', '2021']);
      await complaintsComponent.saveComplaint();
      await expect(await complaintsComponent.fieldError('closed-date')).toBe('Closed Date must be after Received Date');
      await (await complaintsComponent.closedDate).addValue(['23', 'Apr', 'Tab', '2031']);
      await complaintsComponent.saveComplaint();
      await expect(await complaintsComponent.fieldError('closed-date')).toBe('Closed Date must not be in the future');
    });

    it('should be able to close complaint by adding closed date and actions', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Drummond Group',
        receivedDate: ['23', 'Jan', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Developer',
        summary: `Test Summary - ${timestamp}`,
      };
      await complaintsComponent.addNewComplaint();
      await waitForSpinnerToDisappear();
      await complaintsComponent.set(fields);
      await complaintsComponent.saveComplaint();
      await waitForSpinnerToDisappear();
      await complaintsComponent.searchFilter(fields.acbId);
      await complaintsComponent.editComplaint(fields.acbId);
      await (await complaintsComponent.closedDate).addValue(['23', 'Aug', 'Tab', '2021']);
      await complaintsComponent.setActions(`Actions - ${timestamp}`);
      await complaintsComponent.saveComplaint();
      await waitForSpinnerToAppear();
      await waitForSpinnerToDisappear();
      await complaintsComponent.searchFilter(fields.acbId);
      await expect(await getCellValue(FIRST_ROW, STATUS_IDX)).toBe('CLOSED');
    });
  });
});
