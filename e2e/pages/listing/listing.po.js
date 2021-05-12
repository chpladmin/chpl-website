const elements = {
  realWortldTestingHeader: 'h2=Real World Testing',
  seeAll: '#viewAllCerts',
};

class ListingPage {
  constructor () { }

  get realWorldTestingHeader () {
    return $(elements.realWorldTestingHeader);
  }

  get seeAll () {
    return $(elements.seeAll);
  }
}

export default ListingPage;
