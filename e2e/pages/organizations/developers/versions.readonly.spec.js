import Hooks from '../../../utilities/hooks';
import LoginComponent from '../../../components/login/login.sync.po';
import ActionBarComponent from '../../../components/action-bar/action-bar-legacy.po';
import ActionConfirmationComponent from '../../../components/action-confirmation/action-confirmation.po';

import DevelopersPage from './developers.po';

let actionBar;
let actionConfirmation;
let hooks;
let login;
let page;

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
    });

    afterEach(() => {
      login.logOut();
    });

    describe('when on the "Greenway Health, LLC" Developer page', () => {
      let newVersion; let product; let timestamp; let
        version;
      beforeEach(() => {
        const developer = 'Greenway Health, LLC';
        timestamp = (new Date()).getTime();
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
      });

      describe('when merging versions of "Greenway Intergy Meaningful Use Edition" product', () => {
        const versionToBeMerged = 'v10';
        const productId = 837;
        const name = 'Greenway Intergy Meaningful Use Edition';
        beforeEach(() => {
          version = 'v11';
          newVersion = `${version} - ${timestamp}`;
          product = page.getProduct(name);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
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
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
          expect(page.getActiveVersion(product, productId)).toHaveTextContaining(version);
        });

        xit('should require the version', () => {
          page.mergeVersion(product);
          page.moveVersionToBeMerged(versionToBeMerged);
          page.versionName.clearValue();
          expect(page.errorMessage.getText()).toBe('Field is required');
        });
      });

      describe('on "MediaDent 10.0 using Intergy v9" product', () => {
        const name = 'MediaDent 10.0 using Intergy v9';
        beforeEach(() => {
          product = page.getProduct(name);
          product.scrollIntoView({ block: 'center', inline: 'center' });
          page.selectProduct(product);
          page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
        });

        it('should not have split version button as this product has only one listing', () => {
          expect(page.getSplitButton(product)).not.toExist();
        });
      });
    });

    describe('when on the "GetWellNetwork" Developer page, looking at "CareNavigator" Product', () => {
      let product;
      const productName = 'CareNavigator';
      const productId = 2170;
      const version = '2.5';
      beforeEach(() => {
        const developer = 'GetWellNetwork';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
        product = page.getProduct(productName);
        product.scrollIntoView({ block: 'center', inline: 'center' });
        page.selectProduct(product);
        page.getProductInfo(product).waitForDisplayed({ timeout: 55000 });
      });

      it('should have a split for the Version, but not the Product, for a Product that has only one Version, with two Listings', () => {
        page.getSplitButton(product).click();
        expect(page.getSplitButton(product)).toExist();
        expect(page.getProductSplitButton(product).getText()).toBe('Product\n(Cannot split Product with only one Version)');
        expect(page.getVersionSplitButton(product).getText()).toBe('Version\n(Select a specific Version to split)');
        page.selectVersion(product, productId, version);
        page.getSplitButton(product).click();
        expect(page.getVersionSplitButton(product).getText()).toBe('Version');
      });

      it('should allow cancellation of a split', () => {
        const versionCount = page.getVersionCount(product).getText();
        page.selectVersion(product, productId, version);
        page.getSplitButton(product).click();
        page.getVersionSplitButton(product).click();
        page.splitVersionVersion.clearValue();
        page.splitVersionVersion.setValue(Math.random());
        actionBar.cancel();
        actionConfirmation.yes.click();
        page.selectAllCertificationStatus();
        page.productsHeader.waitForDisplayed();
        expect(page.getVersionCount(product).getText()).toBe(versionCount);
      });
    });
  });
});
