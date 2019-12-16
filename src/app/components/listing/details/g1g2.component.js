export const G1G2DetailsComponent = {
    templateUrl: 'chpl.components/listing/details/g1g2.html',
    bindings: {
        listing: '<',
    },
    controller: class G1G2DetailsController {
        constructor ($filter, $log, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.utilService = utilService;
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
            }
            this._analyzeMeasures();
        }

        _analyzeMeasures () {
            var appending, cert, i, j, k;
            this.measures = [];
            for (i = 0; i < this.listing.certificationResults.length; i++) {
                cert = this.listing.certificationResults[i];
                if (cert.g1MacraMeasures || cert.g2MacraMeasures) {
                    for (j = 0; j < cert.g1MacraMeasures.length; j++) {
                        appending = true;
                        for (k = 0; k < this.measures.length; k++) {
                            if (this.measures[k].name === cert.g1MacraMeasures[j].name &&
                                this.measures[k].description === cert.g1MacraMeasures[j].description &&
                                this.measures[k].g === 'G1') {
                                this.measures[k].criteria.push(cert.g1MacraMeasures[j].criteria.number);
                                appending = false;
                            }
                        }
                        if (appending) {
                            this.measures.push({
                                name: cert.g1MacraMeasures[j].name,
                                description: cert.g1MacraMeasures[j].description,
                                g: 'G1',
                                criteria: [cert.g1MacraMeasures[j].criteria.number],
                                removed: cert.g1MacraMeasures[j].removed,
                            });
                        }
                    }
                    for (j = 0; j < cert.g2MacraMeasures.length; j++) {
                        appending = true;
                        for (k = 0; k < this.measures.length; k++) {
                            if (this.measures[k].name === cert.g2MacraMeasures[j].name &&
                                this.measures[k].description === cert.g2MacraMeasures[j].description &&
                                this.measures[k].g === 'G2') {
                                this.measures[k].criteria.push(cert.g2MacraMeasures[j].criteria.number);
                                appending = false;
                            }
                        }
                        if (appending) {
                            this.measures.push({
                                name: cert.g2MacraMeasures[j].name,
                                description: cert.g2MacraMeasures[j].description,
                                g: 'G2',
                                criteria: [cert.g2MacraMeasures[j].criteria.number],
                                removed: cert.g2MacraMeasures[j].removed,
                            });
                        }
                    }
                }
            }
            this.measures.forEach((measure) => {
                measure.criteria = this.$filter('orderBy')(measure.criteria, this.utilService.sortCert);
            });
        }
    },
}

angular
    .module('chpl.components')
    .component('aiG1g2', G1G2DetailsComponent);
