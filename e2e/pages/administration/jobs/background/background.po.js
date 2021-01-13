
const backgroundElements = {
    backgroundJobsRoot: 'chpl-jobs-background-types',
};

class BackgroundPage {
    constructor () { }

    get backgroundJobRowsCount () {
        return $(backgroundElements.backgroundJobsRoot).$('tbody').$$('tr').length;
    }

    backgroundJobNames (rowNumber) {
        return $(backgroundElements.backgroundJobsRoot).$('tbody').$$('tr')[rowNumber].$$('td')[0];
    }

}

export default BackgroundPage;
