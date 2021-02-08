const overviewElements = {
  oncacbatlTable: 'h2=ONC-ACB and ONC-ATL Information',
  rowValue: '#acbAtlTable tbody tr',
  colValue: '#acbAtlTable thead tr th',
};

class OverviewPage {
  constructor () { }

  get acbatlTable () {
    return $(overviewElements.oncacbatlTable);
  }

  get acbatlTableRow () {
    return $$(overviewElements.rowValue);
  }

  get acbatlTableCol () {
    return $$(overviewElements.colValue);
  }

}

export default OverviewPage;
