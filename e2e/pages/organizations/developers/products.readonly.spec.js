import DevelopersPage from './developers.po';
import ContactComponent from '../../../components/contact/contact.po';
import Hooks from '../../../utilities/hooks';

let contact, hooks, page;

describe('the Product part of the Developers page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    contact = new ContactComponent();
    page = new DevelopersPage();
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
});
