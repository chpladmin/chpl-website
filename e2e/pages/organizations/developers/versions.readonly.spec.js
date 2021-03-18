import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks';
import LoginComponent from '../../../components/login/login.po';
import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import ActionConfirmationComponent from '../../../components/action-confirmation/action-confirmation.po';

let actionBar, actionConfirmation, hooks, login, page;

describe('the Version part of the Developers page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new DevelopersPage();
    login = new LoginComponent();
    actionBar = new ActionBarComponent();
    actionConfirmation = new ActionConfirmationComponent();
    hooks = new Hooks();
    await hooks.open('#/organizations/developers');
  });

  describe('when logged in as an Admin', () => {
    beforeEach(() => {
      login.logIn('admin');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      login.logOut();
    });

    describe('when on the "Greenway Health, LLC" Developer page', () => {
      const name = 'Greenway Intergy Meaningful Use Edition';
      const productId = 837;
      let newVersion, product, timestamp, version;
      beforeEach(() => {
        let developer = 'Greenway Health, LLC';
        timestamp = (new Date()).getTime();
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
      });

      describe('when merging versions of "Greenway Intergy Meaningful Use Edition" product', () => {
        const versionToBeMerged = 'v10';
        beforeEach(() => {
          version = 'v11';
          newVersion = version + ' - ' + timestamp;
          product = page.getProduct(name);
          product.scrollIntoView({block: 'center', inline: 'center'});
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({timeout: 55000});
          page.selectVersion(product, productId, version);
        });

        it('should allow cancellation', () => {
          page.mergeVersion(product);
          page.versionName.clearValue();
          page.versionName.addValue(newVersion);
          actionBar.cancel();
          actionConfirmation.yes.click();
          page.productsHeader.waitForDisplayed();
          product = page.getProduct(name);
          product.scrollIntoView({block: 'center', inline: 'center'});
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({timeout: 55000});
          expect(page.getActiveVersion(product, productId)).toHaveTextContaining(version);
        });

        it('should require the version', () => {
          page.mergeVersion(product);
          page.moveVersionToBeMerged(versionToBeMerged);
          page.versionName.clearValue();
          expect(page.errorMessage.getText()).toBe('Field is required');
        });
      });
    });
  });
});
