export const ChartsComponent = {
    templateUrl: 'chpl.charts/charts.html',
    bindings: {
    },
    controller: class ChartsComponent {
        constructor ($log, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onInit () {
            this.chartState = {
                tab: 'product',
            };
            this.loadCriterionProductCountChart();
            this.loadIncumbentDevelopersCountChart();
            this.loadListingCountCharts();
            this.loadNonconformityCountChart();
            this.loadSedParticipantCountChart();
            this.loadParticipantGenderCountChart();
            this.loadParticipantAgeCountChart();
            this.loadParticipantEducationCountChart();
            this.loadParticipantProfessionalExperienceCountChart();
            this.loadParticipantComputerExperienceCountChart();
            this.loadParticipantProductExperienceCountChart();
        }

        ////////////////////////////////////////////////////////////////////

        loadCriterionProductCountChart () {
            let that = this;
            this.networkService.getCriterionProductStatistics().then(data => {
                //Elevate the criteria information in the object, to allow for sorting
                data.criterionProductStatisticsResult = data.criterionProductStatisticsResult.map(stat => {
                    stat.number = stat.criterion.number;
                    stat.title = stat.criterion.title;
                    return stat;
                });
                data.criterionProductStatisticsResult.sort((a, b) => that.utilService.sortCertActual(a, b));
                that.criterionProduct = data;
            });
        }

        loadIncumbentDevelopersCountChart () {
            let that = this;
            this.networkService.getIncumbentDevelopersStatistics().then(data => that.incumbentDevelopers = data);
        }

        loadListingCountCharts () {
            let that = this;
            this.networkService.getListingCountStatistics().then(data => that.listingCountData = data);
        }

        loadNonconformityCountChart () {
            let that = this;
            this.networkService.getNonconformityStatisticsCount().then(data => {
                //Elevate the criteria information in the object, to allow for sorting
                data.nonconformityStatisticsResult = data.nonconformityStatisticsResult.map(stat => {
                    stat.number = stat.criterion ? stat.criterion.number : stat.nonconformityType;
                    stat.title = stat.criterion ? stat.criterion.title : '';
                    return stat;
                });
                data.nonconformityStatisticsResult.sort((a, b) => that.utilService.sortCertActual(a, b));
                that.nonconformityCriteriaCount = data;
            });
        }

        loadSedParticipantCountChart () {
            let that = this;
            this.networkService.getSedParticipantStatisticsCount().then(data => that.sedParticipantStatisticsCount = data);
        }

        loadParticipantGenderCountChart () {
            let that = this;
            this.networkService.getParticipantGenderStatistics().then(data => that.participantGenderCount = data);
        }

        loadParticipantAgeCountChart () {
            let that = this;
            this.networkService.getParticipantAgeStatistics().then(data => that.participantAgeCount = data);
        }

        loadParticipantEducationCountChart () {
            let that = this;
            this.networkService.getParticipantEducationStatistics().then(data => that.participantEducationCount = data);
        }

        loadParticipantProfessionalExperienceCountChart () {
            let that = this;
            this.networkService.getParticipantProfessionalExperienceStatistics().then(data => that.participantProfessionalExperienceCount = data);
        }

        loadParticipantComputerExperienceCountChart () {
            let that = this;
            this.networkService.getParticipantComputerExperienceStatistics().then(data => that.participantComputerExperienceCount = data);
        }

        loadParticipantProductExperienceCountChart () {
            let that = this;
            this.networkService.getParticipantProductExperienceStatistics().then(data => that.participantProductExperienceCount = data);
        }
    },
}

angular.module('chpl.charts')
    .component('chplCharts', ChartsComponent);
