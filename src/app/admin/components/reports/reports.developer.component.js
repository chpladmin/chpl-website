export const ReportsDevelopersComponent = {
    templateUrl: 'chpl.admin/components/reports/reports.developer.html',
    bindings: {
        productId: '<?',
    },
    controller: class ReportsDevelopers {
        constructor ($filter, $log, $uibModal, ReportService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.activityRange = {
                range: 30,
                startDate: new Date(),
                endDate: new Date(),
            };
            this.activityRange.startDate.setDate(this.activityRange.endDate.getDate() - this.activityRange.range + 1); // offset to account for inclusion of endDate in range
            this.filename = 'Reports_' + new Date().getTime() + '.csv';

            this.$log.info('In the constructor');
        }

        $onChanges (changes) {
            this.$log.info('In the onChange');
            if (changes.productId && changes.productId.currentValue) {
                let that = this;
                this.activityRange.endDate = new Date();
                this.activityRange.startDate = new Date('4/1/2016');
                this.productId = angular.copy(changes.productId.currentValue);
                this.networkService.getSingleCertifiedProductMetadataActivity(this.productId)
                    .then(results => {
                        that.results = results;
                        that.prepare(that.results, true);
                    });
            } else {
                this.$log.info('Calling search');
                this.search();
            }
        }

        search () {
            this.$log.info('In the search');
            let that = this;
            this.networkService.getActivityMetadata('developers', this.dateAdjust(this.activityRange))
                .then(results => {
                    this.$log.info('Processing results');
                    that.results = results;
                    that.prepare(that.results);
                });
        }

        prepare (results, full) {
            this.activeAcbs = [];
            this.displayed = results.map(item => {
                item.filterText = item.developerName + '|' + item.productName + '|' + item.chplProductNumber
                item.categoriesFilter = '|' + item.categories.join('|') + '|';
                item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
                item.friendlyCertificationDate = new Date(item.certificationDate).toISOString().substring(0, 10);
                if (this.activeAcbs.indexOf(item.acbName) === -1) {
                    this.activeAcbs.push(item.acbName);
                }
                if (full) {
                    this.parse(item);
                    item.showDetails = true;
                }
                return item;
            });
        }
    },
}

angular.module('chpl.admin')
    .component('chplReportsDevelopers', ReportsDevelopersComponent);
