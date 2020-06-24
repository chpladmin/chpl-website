import OverviewPage from "../page-objects/OverviewPage.js"
import HomePage from "../page-objects/HomePage.js";

beforeEach(async () => {
  await HomePage.open();
});

describe('Overview page', () => {

  beforeEach(function() {
    HomePage.gotoResourcePage();
  });
  
  it('should have ONC ACB ATL table', () => {
    assert.equal(OverviewPage.acbatlTable.isDisplayed(),true);
  })

  it('should have correct acb and atl in the table', () => {
    OverviewPage.compareTableData();
    assert.equal(OverviewPage.compareTableData(),true);
   })
})
