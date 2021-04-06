const elements = {
  bodyText: 'ai-body-text',
  listingTable: 'table',
};

class CollectionsPage {
  constructor () { }

  get bodyText () {
    return $(elements.bodyText);
  }

  getListingTableHeaders () {
    return $(elements.listingTable).$('thead').$$('th');
  }
}

export default CollectionsPage;
