import LoginComponent from '../../components/login/login.po';
import ComplaintsComponent from '../../components/surveillance/complaints/complaints.po';
import ActionBarComponent from '../../components/action-bar/action-bar.async.po';
import { open } from '../../utilities/hooks.async';

let login;
let action;
let complaintsComponent;
const ACB_ID_IDX = 3;

beforeEach(async () => {
  login = new LoginComponent();
  complaintsComponent = new ComplaintsComponent();
  action = new ActionBarComponent();
  await open('#/resources/overview');
});

describe('managing complaints', () => {
  describe('as a ROLE_ACB user', () => {
    beforeEach(async () => {
      await login.logIn('drummond');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should not be able to add new complaint without required fields', async () => {
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.saveComplaint();
      await expect(await complaintsComponent.fieldError('certification-body')).toBe('ONC-ACB is required');
      await expect(await complaintsComponent.fieldError('received-date')).toBe('Received Date is required');
      await expect(await complaintsComponent.fieldError('complainant-type')).toBe('Complainant Type is required');
      await expect(await complaintsComponent.fieldError('acb-complaint-id')).toBe('ONC-ACB Complaint ID is required');
      await expect(await complaintsComponent.fieldError('summary')).toBe('Complaint Summary is required');
    });

    it('should be able to add new complaint with only required fields', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Drummond Group',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Developer',
        summary: `Test Summary - ${timestamp}`,
      };
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.set(fields);
      await complaintsComponent.saveComplaint();
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
      await (await complaintsComponent.filter).addValue(fields.acbId);
      await (browser.waitUntil(async () => (await complaintsComponent.getResults()).length === 1));
      const complaint = (await complaintsComponent.getTableComplaints())[0];
      await expect(await (await complaintsComponent.getComplaintCell(complaint, ACB_ID_IDX)).getText()).toBe(fields.acbId);
    });

    it('should be able to add new complaint with open surveillance for a 2015 listing', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Drummond Group',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Developer',
        summary: `Test Summary - ${timestamp}`,
      };
      const optionalFields = {
        oncId: `Test - ${timestamp}`,
        actions: `Test - ${timestamp}`,
        criterion: '170.315 (a)(4): Drug-Drug, Drug-Allergy Interaction Checks for CPOE',
        listings: '15.04.04.2838.PARA.17.00.1.171228',
        surveillance: '15.04.04.2838.PARA.17.00.1.171228: SURV01',
      };
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.set(fields);
      await complaintsComponent.setOptionalFields(optionalFields);
      await complaintsComponent.saveComplaint();
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
      await (await complaintsComponent.filter).addValue(fields.acbId);
      await (browser.waitUntil(async () => (await complaintsComponent.getResults()).length === 1));
      const complaint = (await complaintsComponent.getTableComplaints())[0];
      await expect(await (await complaintsComponent.getComplaintCell(complaint, ACB_ID_IDX)).getText()).toBe(fields.acbId);
    });

    it('should be able to add new complaint for a 2015 listing with multiple surveillance activities', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Drummond Group',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Government Entity',
        summary: `Test Summary - ${timestamp}`,
      };
      const optionalFields = {
        oncId: `Test - ${timestamp}`,
        actions: `Test - ${timestamp}`,
        criterion: '170.315 (b)(9): Care Plan',
        listings: '15.04.04.3010.Onco.28.01.1.181214',
        surveillance: '15.04.04.3010.Onco.28.01.1.181214: SURV01',
      };
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.set(fields);
      await complaintsComponent.setOptionalFields(optionalFields);
      await complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV02');
      await complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV03');
      await complaintsComponent.saveComplaint();
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
      await (await complaintsComponent.filter).addValue(fields.acbId);
      await (browser.waitUntil(async () => (await complaintsComponent.getResults()).length === 1));
      const complaint = (await complaintsComponent.getTableComplaints())[0];
      await expect(await (await complaintsComponent.getComplaintCell(complaint, ACB_ID_IDX)).getText()).toBe(fields.acbId);
    });

    it('should be able to add new complaint for multiple listings and surveillance activities', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Drummond Group',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Provider',
        summary: `Test Summary - ${timestamp}`,
      };
      const optionalFields = {
        oncId: `Test - ${timestamp}`,
        actions: `Test - ${timestamp}`,
        criterion: '170.315 (b)(9): Care Plan',
        listings: '15.04.04.2838.PARA.17.00.1.171228',
        surveillance: '15.04.04.2838.PARA.17.00.1.171228: SURV01',
      };
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.set(fields);
      await complaintsComponent.setOptionalFields(optionalFields);
      await complaintsComponent.selectListing('15.04.04.3010.Onco.28.01.1.181214');
      await complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV02');
      await complaintsComponent.selectSurveillance('15.04.04.3010.Onco.28.01.1.181214: SURV03');
      await complaintsComponent.saveComplaint();
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
      await (await complaintsComponent.filter).addValue(fields.acbId);
      await (browser.waitUntil(async () => (await complaintsComponent.getResults()).length === 1));
      const complaint = (await complaintsComponent.getTableComplaints())[0];
      await expect(await (await complaintsComponent.getComplaintCell(complaint, ACB_ID_IDX)).getText()).toBe(fields.acbId);
    });
  });

  describe('as a ROLE_ADMIN user', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
    });

    afterEach(async () => {
      if (action.errors.length > 0) {
        await action.closeMessages();
      }
      await login.logOut();
    });

    it('should be able to add new complaint for any ONC-ACB, including retired ONC-ACBs', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Surescripts LLC (Retired)',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Patient',
        summary: `Test Summary - ${timestamp}`,
      };
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.set(fields);
      await complaintsComponent.saveComplaint();
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
      await (await complaintsComponent.filter).addValue(fields.acbId);
      await (browser.waitUntil(async () => (await complaintsComponent.getResults()).length === 1));
      const complaint = (await complaintsComponent.getTableComplaints())[0];
      await expect(await (await complaintsComponent.getComplaintCell(complaint, ACB_ID_IDX)).getText()).toBe(fields.acbId);
    });

    it('should not be able to add new complaint where listing and complaint have a mismatched ONC-ACB', async () => {
      const timestamp = Date.now();
      const fields = {
        body: 'Surescripts LLC (Retired)',
        receivedDate: ['23', 'Jun', 'Tab', '2021'],
        acbId: `Test - ${timestamp}`,
        type: 'Patient',
        summary: `Test Summary - ${timestamp}`,
      };
      const optionalFields = {
        oncId: `Test - ${timestamp}`,
        actions: `Test - ${timestamp}`,
        criterion: '170.315 (b)(9): Care Plan',
        listings: '15.04.04.3010.Onco.28.01.1.181214',
        surveillance: '15.04.04.3010.Onco.28.01.1.181214: SURV01',
      };
      await complaintsComponent.addNewComplaint();
      await complaintsComponent.set(fields);
      await complaintsComponent.setOptionalFields(optionalFields);
      await complaintsComponent.saveComplaint();
      await expect(await (await action.errors).getText()).toContain('Certified product 15.04.04.3010.Onco.28.01.1.181214 does not have the same ONC-ACB as the complaint.');
    });
  });

  describe('as a ROLE_ONC user', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await open('#/surveillance/complaints');
      await (browser.waitUntil(async () => complaintsComponent.hasResults()));
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should not see add new complaint button', async () => {
      await expect(await complaintsComponent.newComplaintButton.isDisplayed()).toBe(false);
    });
  });
});
