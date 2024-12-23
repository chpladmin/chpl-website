import DeveloperPage from '../pageobjects/developer.page';
import LoginComponent from '../pageobjects/login-component.page';

let login;
let page;

describe('the Developer page for "gMed, Inc."', () => {
  beforeEach(async () => {
    page = new DeveloperPage();
    await page.open(1614);
  });

  it('should have a title', async () => {
    await expect(page.title).toHaveText('gMed, Inc.');
  });

  it('should not have the developer edit button', async () => {
    await expect(page.editDeveloperButton).not.toBeExisting();
  });

  describe('the Products section', () => {
    it('should have no results found by default', async () => {
      await expect(await page.getProductsSearchResults()).toHaveText(expect.stringContaining('No results found'));
    });

    describe('when browsing all listings', () => {
      beforeEach(async () => {
        await page.browseAllListings();
      });

      it('should not have "no results found"', async () => {
        await expect(await page.getProductsSearchResults()).not.toHaveText(expect.stringContaining('No results found'));
      });

      it('should have seven products', async () => {
        const products = await page.getProducts();
        expect(products.length).toBe(7);
      });

      it('should show "gGastro" as the third product', async () => {
        const products = await page.getProducts();
        const productName = await page.getProductName(products[2]);
        expect(productName).toHaveText('gGastro');
      });
    });

    describe('when filtering listings', () => {
      beforeEach(async () => {
        await page.browseAllListings();
      });

      it('should allow selection of a certification status', async () => {
        await page.filterBy('certificationStatuses', 'Withdrawn_by_Developer');
        const products = await page.getProducts();
        const productName = await page.getProductName(products[4]);
        expect(products.length).toBe(5);
        expect(productName).toHaveText('gMed Connect');
      });
    });

    describe('when looking at individual products', () => {
      beforeEach(async () => {
        await page.browseAllListings();
        await page.filterBy('certificationStatuses', 'Withdrawn_by_Developer');
        await page.viewProduct('gCardio');
      });

      it('should have two listings', async () => {
        const listings = await page.getListings('gCardio');
        expect(listings.length).toBe(2);
      });
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('onc');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have the developer edit button', async () => {
      await expect(page.editDeveloperButton).toBeExisting();
    });

    it('should have the product/version merge button', async () => {
      await page.browseAllListings();
      await page.filterBy('certificationStatuses', 'Withdrawn_by_Developer');
      await page.viewProduct('gCardio');
      await expect(await page.getMergeProductButton(2538)).toBeExisting();
    });
  });

  describe('when logged in as ONC-ACB', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('drummond');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have the developer edit button', async () => {
      await expect(page.editDeveloperButton).toBeExisting();
    });

    it('should not have the product/version merge button', async () => {
      await page.browseAllListings();
      await page.filterBy('certificationStatuses', 'Withdrawn_by_Developer');
      await page.viewProduct('gCardio');
      await expect(await page.getMergeProductButton(2538)).not.toBeExisting();
    });
  });
});
