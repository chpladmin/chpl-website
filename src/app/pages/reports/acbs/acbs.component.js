export const ReportsAcbsComponent = {
    templateUrl: 'chpl.reports/acbs/acbs.html',
    bindings: {},
    controller: class ReportsAcbsComponent {
        constructor ($log, $scope, ReportService, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
        }

        $onInit () {
            let that = this;
            this.networkService.getActivityMetadata('acbs')
                .then(results => {
                    that.results = results;
                    that.prepare(that.results);
                });
        }

        downloadReady () {
            return this.displayed.reduce((acc, activity) => activity.action && acc, this.displayed);
        }

        parse (meta) {
            return this.networkService.getActivityById(meta.id).then(item => {
                const simpleFields = [
                    {key: 'name', display: 'Name'},
                    {key: 'retired', display: 'Retired'},
                    {key: 'retirementDate', display: 'Retirement Date', filter: 'date'},
                    {key: 'website', display: 'Website'},
                ];

                let activity = {
                    action: '',
                    details: [],
                    date: item.activityDate,
                };

                if (item.originalData && !angular.isArray(item.originalData) && item.newData) { // both exist, originalData not an array: update
                    if (item.originalData.deleted !== item.newData.deleted) {
                        activity.action = item.newData.deleted ? 'ONC-ACB was deleted' : 'ONC-ACB was restored';
                    } else if (item.originalData.retired !== item.newData.retired) {
                        activity.action = item.newData.retired ? 'ONC-ACB was retired' : 'ONC-ACB was un-retired';
                    } else {
                        activity.action = 'ONC-ACB was updated';
                        simpleFields.forEach(field => {
                            let change = this.ReportService.compareItem(item.originalData, item.newData, field.key, field.display, field.filter);
                            if (change) {
                                activity.details.push(change);
                            }
                        });
                        let addressChanges = this.ReportService.compareAddress(item.originalData.address, item.newData.address);
                        if (addressChanges && addressChanges.length > 0) {
                            activity.details.push('Address changes<ul>' + addressChanges.join('') + '</ul>');
                        }
                    }
                } else {
                    this.ReportService.interpretNonUpdate(activity, item, 'ACB');
                }

                meta.action = activity.action;
                meta.details = activity.details;
                meta.csvDetails = activity.details.join('\n');
            });
        }

        prepare (results) {
            this.displayed = results
                .map(item => {
                    item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
                    return item;
                })
                .forEach(item => this.parse(item));
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsAcbs', ReportsAcbsComponent);
