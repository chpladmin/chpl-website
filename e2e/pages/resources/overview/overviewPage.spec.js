import OverviewPage from "./OverviewPage.po.js"
import SearchPage from "../../../pages/search/SearchPage.po.js";

beforeEach(async () => {
  await SearchPage.open();
});

describe('Overview page', () => {

  beforeEach(function() {
    SearchPage.gotoResourcePage();
  });
  
  it('should have ONC ACB ATL table', () => {
    assert.equal(OverviewPage.acbatlTable.isDisplayed(),true);
  })

  it('should have correct acb and atl in the table', () => {
    OverviewPage.compareTableData();
    assert.equal(OverviewPage.compareTableData(),true);
   })
})
