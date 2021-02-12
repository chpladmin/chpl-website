const backgroundElements = {
  backgroundJobsRoot: 'chpl-jobs-background-types',
};

class BackgroundPage {
  constructor () { }

  get backgroundJobRows () {
    return $(backgroundElements.backgroundJobsRoot).$('tbody').$$('tr');
  }

  backgroundJobName (rowNumber) {
    return $(backgroundElements.backgroundJobsRoot).$('tbody').$$('tr')[rowNumber].$$('td')[0];
  }

}

export default BackgroundPage;
