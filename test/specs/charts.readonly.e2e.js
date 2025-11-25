import ChartsPage from '../pageobjects/charts.page';

let page;

describe('the Charts page', () => {
  beforeEach(async () => {
    page = new ChartsPage();
    await page.open();
  });

  it('should have a title', async () => {
    await expect(page.title).toHaveText('Charts');
  });

  it('should have Criteria Attributes chart', async () => {
    await expect(page.criteriaAttributesButton).toBeExisting();
  });

  it('should have Criteria Migration - (a)(9) to (b)(11) chart', async () => {
    await expect(page.criteriaMigrationReportButton).toBeExisting();
  });

  it('should have Developer Statistics chart', async () => {
    await expect(page.developerStatisticsButton).toBeExisting();
  });

  it('should have Listing Attributes chart', async () => {
    await expect(page.listingAttributesButton).toBeExisting();
  });

  it('should have Listing Statistics chart', async () => {
    await expect(page.listingStatisticsButton).toBeExisting();
  });

  it('should have Non-Conformity Counts chart', async () => {
    await expect(page.nonConformityCountsButton).toBeExisting();
  });

  it('should have Product Statistics chart', async () => {
    await expect(page.productStatisticsButton).toBeExisting();
  });

  it('should have SVAP Usage by Criteria chart', async () => {
    await expect(page.svapUsageByCriteriaButton).toBeExisting();
  });

  it('should have SVAP Usage by SVAP chart', async () => {
    await expect(page.svapUsageBySvapButton).toBeExisting();
  });

  it('should have Service Base URL List Report chart', async () => {
    await expect(page.serviceBaseUrlReportButton).toBeExisting();
  });

  it('should have Unique Products chart', async () => {
    await expect(page.uniqueProductsButton).toBeExisting();
  });
});
