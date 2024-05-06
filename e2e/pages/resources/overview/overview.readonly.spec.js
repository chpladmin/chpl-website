import OverviewPage from './overview.po';
import { open } from '../../../utilities/hooks';
import EnvironmentIndicatorComponent from '../../../components/environment-indicator/environment-indicator.po';

let indicator;
let page;

beforeEach(async () => {
  page = new OverviewPage();
  indicator = new EnvironmentIndicatorComponent();
  await open('#/resources/overview');
});

describe('the Overview page', () => {
  it('should have an indicator to show non prod environment', async () => {
    await expect(await indicator.nonProdIndicator.isDisplayed()).toBe(true);
  });

  it('should have an ONC ACB ATL table', async () => {
    await expect(await page.acbatlTable.isDisplayed()).toBe(true);
  });

  it('should have acb and atl data in the table', async () => {
    const rowcount = page.acbatlTableRow.length;
    const colcount = page.acbatlTableCol.length;
    const actualResult = [];
    for (let i = 1; i <= rowcount; i++) {
      for (let j = 1; j <= colcount - 2; j++) {
        const cellvalue = $(`#acbAtlTable tbody tr:nth-child(${i}) td:nth-child(${j})`).getText();
        actualResult.push(cellvalue);
      }
    }
    const expectedTableVlaues = ['ONC-ACB', 'Drummond Group', 'ONC-ACB', 'ICSA Labs', 'ONC-ACB', 'SLI Compliance', 'ONC-ACB', 'UL LLC', 'ONC-ATL', 'Drummond Group', 'ONC-ATL', 'ICSA Labs', 'ONC-ATL', 'National Committee for Quality Assurance (NCQA)', 'ONC-ATL', 'SLI Compliance', 'ONC-ATL', 'UL LLC'];
    let isSame = false;
    for (let k = 0; k < actualResult.length; k++) {
      if (actualResult[k] === expectedTableVlaues[k]) {
        isSame = true;
      }
    }
    await expect(isSame).toBe(true);
  });
});
