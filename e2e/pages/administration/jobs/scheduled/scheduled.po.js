const scheduledElements = {
  scheduledJobsRoot: 'chpl-jobs-scheduled-jobs',
};

class ScheduledPage {
  constructor () { }

  get scheduledJobRows () {
    return $(scheduledElements.scheduledJobsRoot).$('tbody').$$('tr');
  }

  scheduledJobName (rowNumber) {
    return $(scheduledElements.scheduledJobsRoot).$('tbody').$$('tr')[rowNumber].$$('td')[0];
  }

  get scheduledJobTable () {
    return $(scheduledElements.scheduledJobsRoot).$('tbody');
  }

}

export default ScheduledPage;
