import ActionBarComponent from '../../../components/action-bar/action-bar-legacy.po';
import ActionConfirmationComponent from '../../../components/action-confirmation/action-confirmation.po';
import ContactComponent from '../../../components/contact/contact.po';
import LoginComponent from '../../../components/login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import DevelopersPage from './developers.po';

let actionBar;
let actionConfirmation;
let contact;
let hooks;
let login;
let page;

describe('the Product part of the Developers page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new DevelopersPage();
    actionBar = new ActionBarComponent();
    actionConfirmation = new ActionConfirmationComponent();
    contact = new ContactComponent();
    login = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/organizations/developers');
  });

  describe('when on the "GE Healthcare" Developer page, on the "Centricity Perinatal" Product', () => {
    const developer = 'GE Healthcare';
    const productName = 'Centricity Perinatal';
    let product;

    beforeEach(() => {
      page.selectDeveloper(developer);
      page.getDeveloperPageTitle(developer).waitForDisplayed();
      page.selectAllCertificationStatus();
      product = page.getProduct(productName);
      product.scrollIntoView({ block: 'center', inline: 'center' });
      page.selectProduct(product);
      page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
    });

    it('should have product Contact information', () => {
      expect(contact.get(product)).toHaveTextContaining('Tamara Grassle');
    });

    it('should have surveillance data', () => {
      expect(page.getSurveillanceData(product).getText()).toBe('0 open / 1 surveillance');
    });

    it('should have listings count', () => {
      expect(page.getListingCount(product).getText()).toBe('6 listings');
    });
  });

  describe('when on the "Procentive" Developer page, on the "Procentive" Product', () => {
    const developer = 'Procentive';
    const productName = 'Procentive';
    const productId = '1987';
    let product;

    beforeEach(() => {
      page.selectDeveloper(developer);
      page.getDeveloperPageTitle(developer).waitForDisplayed();
      page.selectAllCertificationStatus();
      product = page.getProduct(productName);
      product.scrollIntoView({ block: 'center', inline: 'center' });
      page.selectProduct(product);
      page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
    });

    it('should have Versions', () => {
      expect(page.getActiveVersion(product, productId)).toHaveTextContaining('2011');
    });

    it('should not have an edit button', () => {
      expect(page.getEditButton(product)).not.toExist();
    });
  });

  describe('when logged in as an ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
    });

    afterEach(() => {
      login.logOut();
    });

    describe('when on the "ADVault, Inc." Developer page, on the "MyDirectives" Product', () => {
      const developer = 'ADVault, Inc.';
      const productName = 'MyDirectives';
      let product;

      beforeEach(() => {
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
        product = page.getProduct(productName);
        product.scrollIntoView({ block: 'center', inline: 'center' });
        page.selectProduct(product);
        page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
      });

      it('should not have merge product button as this developer has only one product', () => {
        expect(page.getMergeButton(product)).not.toExist();
      });
    });

    describe('when on the "Medical Information Technology, Inc. (MEDITECH)" Developer page', () => {
      const developer = 'Medical Information Technology, Inc. (MEDITECH)';
      let product;

      beforeEach(() => {
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
      });

      describe('when on the "MEDITECH Expanse 2.2 Oncology" product', () => {
        const productName = 'MEDITECH Expanse 2.2 Oncology';

        beforeEach(() => {
          product = page.getProduct(productName);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
        });

        it('should not have a split button for the porduct with only one version)', () => {
          expect(page.getSplitButton(product)).not.toExist();
        });
      });

      describe('when on the "MEDITECH MAGIC Electronic Health Record Core HCIS" product', () => {
        const productName = 'MEDITECH MAGIC Electronic Health Record Core HCIS';

        beforeEach(() => {
          product = page.getProduct(productName);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
        });

        it('should have a product split', () => {
          expect(page.getSplitButton(product)).toExist();
        });

        it('should allow cancellation of a split', () => {
          const productCount = page.products.length;
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.splitProduct(product);
          page.editProductName.clearValue();
          page.editProductName.setValue(Math.random());
          actionBar.cancel();
          actionConfirmation.yes.click();
          page.selectAllCertificationStatus();
          page.productsHeader.waitForDisplayed();
          expect(page.getProduct(productName)).toExist();
          expect(page.products.length).toBe(productCount);
        });
      });
    });
  });
});

