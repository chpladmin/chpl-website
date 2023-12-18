import ComparePage from './compare.po';

let page;

describe('the compare page', () => {
  beforeEach(async () => {
    page = new ComparePage();
    await page.open([9261, 11079]);
  });

  it('should know what the decertification date is', async () => {
    await expect(await page.getDecertificationDate('15.02.02.3007.A056.01.00.0.180214')).toBe('Jul 19, 2021');
    await expect(await page.getDecertificationDate('15.04.04.2916.smar.07.02.1.221216')).toBe('N/A');
  });

  it('should correctly display the criteria number/title', async () => {
    await expect(await (await page.getCellWithCriteriaId('1')).getText()).toBe('170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications');
  });

  it('should correctly display the retired criteria number/title', async () => {
    await expect(await (await page.getCellWithCriteriaId('27')).getText()).toContain('Removed | 170.315 (c)(3): Clinical Quality Measures - Report');
  });

  it('should correctly display the cqm number/title', async () => {
    await expect(await (await page.getCellWithCqmId('286374')).getText()).toBe('CMS50: Closing the Referral Loop: Receipt of Specialist Report');
  });
});
