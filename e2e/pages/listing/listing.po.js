const elements = {
  realWortldTestingHeader: 'h2=Real World Testing',
  seeAll: '#viewAllCerts',
  editCertifiedProduct: '//button[text()=" Edit Certified Product"]',
  reason: '#reason-for-change',
};

class ListingPage {
  constructor() { }

  get realWorldTestingHeader() {
    return $(elements.realWorldTestingHeader);
  }

  get seeAll() {
    return $(elements.seeAll);
  }

  get editCertifiedProduct() {
    return $(elements.editCertifiedProduct);
  }

  get reason() {
    return $(elements.reason);
  }
}

export default ListingPage;
