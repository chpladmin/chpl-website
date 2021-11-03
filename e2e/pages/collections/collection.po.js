class CollectionPage {
  constructor() {
    this.elements = {
      bodyText: '.makeStyles-content-3',
      listingTable: 'table',
    };
  }

  get bodyText() {
    return $(this.elements.bodyText);
  }

  getListingTableHeaders() {
    return $(this.elements.listingTable).$('thead').$$('th');
  }

  getColumnText(rowNumber, columnNumber) {
    return $(this.elements.listingTable)
      .$('tbody')
      .$(`tr[${rowNumber}]`)
      .$(`td[${columnNumber}]`)
      .getText();
  }
}

export default CollectionPage;
