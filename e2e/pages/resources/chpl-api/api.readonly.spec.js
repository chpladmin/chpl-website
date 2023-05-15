import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../../components/toast/toast.async.po';

import ApiPage from './api.po';

let hooks;
let page;
let toast;

describe('the CHPL API page', () => {
  beforeEach(async () => {
    page = new ApiPage();
    hooks = new Hooks();
    toast = new ToastComponent();
    await hooks.open('#/resources/api');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should have a title', async () => {
    await expect(await page.getTitle()).toBe('CHPL API');
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('The ONC CHPL API provides programmatic access to ONC published data on Certified Health IT Products');
  });

  it('should allow users to register for API key', async () => {
    await page.register('test', 'test@testorg.com');
    await (browser.waitUntil(async () => (await (toast.toastMessage)).isDisplayed()));
    await expect(await (await toast.toastMessage).getText()).toEqual('To confirm your email address, an email was sent to: test@testorg.com Please follow the instructions in the email to obtain your API key.');
  });

  it('should have controllers and endpoints information', async () => {
    await (await (page.announcementsController).scrollIntoView());
    await hooks.waitForSpinnerToDisappear();
    await (await page.attestationController).click();
    await (await page.getAttestationEndpoint).click();
    await expect(await (await page.getAttestationEndpoint).getText()).toContain('Attestation Periods define the time period which an Attestion applies.');
  });
});
