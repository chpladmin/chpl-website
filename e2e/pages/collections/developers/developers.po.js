import CollectionsPage from '../collections.po';

const elements = {
  dateFilter: '#filter-button-decertificationDate',
  fromDate: '#after',
  toDate: '#before'
}

class DevelopersPage extends CollectionsPage {
  constructor() {
    super();
  }

  get dateFilter() {
    return $(elements.dateFilter);
  }

  get fromDate() {
    return $(elements.fromDate);
  }

  get toDate() {
    return $(elements.toDate);
  }

}

export default DevelopersPage;
