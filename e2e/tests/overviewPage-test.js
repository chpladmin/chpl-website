import overviewPage from "../page-objects/overviewPage.js"
import homePage from "../page-objects/homePage.js";

beforeEach(async () => {
  await homePage.open();
});

describe('Overview page', () => {

  beforeEach(function() {
    homePage.gotoResourcePage();
  });
  
  it('should have ONC ACB ATL table', () => {
    assert.equal(overviewPage.acbatlTable.isDisplayed(),true);
  })

  it('should have correct acb and atl in the table', () => {
    overviewPage.compareTableData();
    assert.equal(overviewPage.compareTableData(),true);
   })
})
