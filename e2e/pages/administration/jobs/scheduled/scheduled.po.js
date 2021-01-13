
const scheduledElements = {
    scheduledJobsRoot: 'chpl-jobs-scheduled-jobs',
};

class ScheduledPage {
    constructor () { }

    get scheduledJobRowsCount () {
        return $(scheduledElements.scheduledJobsRoot).$('tbody').$$('tr').length;
    }

    scheduledJobNames (rowNumber) {
        return $(scheduledElements.scheduledJobsRoot).$('tbody').$$('tr')[rowNumber].$$('td')[0];
    }

}

export default ScheduledPage;
