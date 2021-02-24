import DevelopersPage from './developers.po';
import ContactComponent from '../../../components/contact/contact.po';
import Hooks from '../../../utilities/hooks';
import LoginComponent from '../../../components/login/login.po';
import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import ActionConfirmationComponent from '../../../components/action-confirmation/action-confirmation.po';

let actionBar, actionConfirmation, contact, hooks, login, page;

describe('the Developers page Product information', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    contact = new ContactComponent();
    login = new LoginComponent();
    page = new DevelopersPage();
    actionBar = new ActionBarComponent();
    actionConfirmation = new ActionConfirmationComponent();
    hooks = new Hooks();
    await hooks.open('#/organizations/developers');
  });

  describe('when on the "GE Healthcare" Developer page, on the "Centricity Perinatal" Product', () => {
    let developer = 'GE Healthcare';
    let productName = 'Centricity Perinatal';
    let product;

    beforeEach(() => {
      page.selectDeveloper(developer);
      page.getDeveloperPageTitle(developer).waitForDisplayed();
      product = page.getProduct(productName);
      product.scrollIntoView({block: 'center', inline: 'center'});
      page.selectProduct(product);
      page.getProductInfo(product).waitForDisplayed({timeout: 55000});
    });

    it('should have product Contact information', () => {
      expect(contact.get(product)).toHaveTextContaining('Tamara Grassle');
    });

    it('should have ACB name', () => {
      expect(page.getAcbName(product).getText()).toBe('UL LLC');
    });

    it('should have listings count', () => {
      expect(page.getListingCount(product).getText()).toBe('6 listings');
    });
  });

  describe('when on the "Procentive" Developer page, on the "Procentive" Product', () => {
    let developer = 'Procentive';
    let productName = 'Procentive';
    let productId = '1987';
    let product;

    beforeEach(() => {
      page.selectDeveloper(developer);
      page.getDeveloperPageTitle(developer).waitForDisplayed();
      product = page.getProduct(productName);
      product.scrollIntoView({block: 'center', inline: 'center'});
      page.selectProduct(product);
      page.getProductInfo(product).waitForDisplayed({timeout: 55000});
    });

    it('should have Versions', () => {
      expect(page.getActiveVersion(product, productId)).toHaveTextContaining('2011');
    });

    it('should not have an edit button', () => {
      expect(page.getEditButton(product)).not.toExist();
    });
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
          page.mergeButton.click();
          page.versionMergeButton.click();
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

        it('version name is required field', () => {
          page.mergeButton.click();
          page.versionMergeButton.click();
          page.moveVersionToBeMerged(versionToBeMerged);
          page.versionName.clearValue();
          expect(page.errorMessage.getText()).toBe('Field is required');
        });
      });
    });
  });
});
