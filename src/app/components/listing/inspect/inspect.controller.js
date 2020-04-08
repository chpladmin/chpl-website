(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('InspectController', InspectController);

    /** @ngInject */
    function InspectController ($log, $uibModal, $uibModalInstance, developers, featureFlags, inspectingCp, networkService, resources, utilService) {
        var vm = this;

        vm.loadDev = loadDev;
        vm.selectInspectingDeveloper = selectInspectingDeveloper;
        vm.setDeveloperChoice = setDeveloperChoice;

        vm.selectInspectingProduct = selectInspectingProduct;
        vm.setProductChoice = setProductChoice;

        vm.selectInspectingVersion = selectInspectingVersion;
        vm.setVersionChoice = setVersionChoice;

        vm.confirm = confirm;
        vm.reject = reject;
        vm.editListing = editListing;

        vm.next = next;
        vm.previous = previous;
        vm.isDisabled = isDisabled;
        vm.cancel = cancel;

        vm.isBlank = utilService.isBlank;
        vm.getAttestationForCurrentSystemDeveloper = getAttestationForCurrentSystemDeveloper;
        vm.populateDeveloperSystemRequirements = populateDeveloperSystemRequirements;

        vm.isOn = featureFlags.isOn;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.cp = angular.copy(inspectingCp);
            vm.stage = 'dev';

            vm.developers = developers;
            vm.products = [];
            vm.versions = [];
            vm.loadDev();

            vm.errorMessages = [];
            vm.systemRequirements = [];
            vm.resources = resources;

            if (!vm.cp.developer.country) {
                vm.cp.developer.country = 'USA';
            }
        }

        function loadDev () {
            if (vm.cp.developer && vm.cp.developer.developerId) {
                networkService.getDeveloper(vm.cp.developer.developerId)
                    .then(function (result) {
                        vm.developer = result;
                    });
            }
        }

        function selectInspectingDeveloper (developerId) {
            vm.cp.developer.developerId = developerId;
            vm.loadDev();
        }

        function setDeveloperChoice (choice) {
            vm.developerChoice = choice;
        }

        function selectInspectingProduct (productId) {
            vm.cp.product.productId = productId;
        }

        function setProductChoice (choice) {
            vm.productChoice = choice;
        }

        function selectInspectingVersion (versionId) {
            vm.cp.version.versionId = versionId;
        }

        function setVersionChoice (choice) {
            vm.versionChoice = choice;
        }

        function confirm () {
            networkService.confirmPendingCp(vm.cp)
                .then(function (result) {
                    $uibModalInstance.close({status: 'confirmed', developerCreated: vm.developerChoice === 'create', developer: result.developer});
                }, function (error) {
                    if (error.data.contact) {
                        $uibModalInstance.close({
                            contact: error.data.contact,
                            objectId: error.data.objectId,
                            status: 'resolved',
                        });
                    } else {
                        vm.errorMessages = error.data.errorMessages;
                    }
                });
        }

        function reject () {
            networkService.rejectPendingCp(vm.cp.id)
                .then(function () {
                    $uibModalInstance.close({status: 'rejected'});
                }, function (error) {
                    if (error.data.contact) {
                        $uibModalInstance.close({
                            contact: error.data.contact,
                            objectId: error.data.objectId,
                            status: 'resolved',
                        });
                    } else {
                        vm.errorMessages = error.data.errorMessages;
                    }
                });
        }

        function editListing (listing) {
            vm.cp = listing;
        }

        function next () {
            switch (vm.stage) {
            case 'dev':
                vm.stage = 'prd';
                break;
            case 'prd':
                vm.stage = 'ver';
                loadFamily();
                break;
            case 'ver':
                vm.stage = 'cp';
                break;
            default:
                break;
            }
        }

        function previous () {
            switch (vm.stage) {
            case 'prd': vm.stage = 'dev';
                break;
            case 'ver': vm.stage = 'prd';
                break;
            case 'cp': vm.stage = 'ver';
                break;
            default:
                break;
            }
        }

        function isDisabled () {
            switch (vm.stage) {
            case 'dev':
                return (vm.developerChoice === 'choose' && !vm.cp.developer.developerId) || !isSystemDevContactInfoValid();
            case 'prd':
                return (vm.productChoice === 'choose' && !vm.cp.product.productId);
            case 'ver':
                return (vm.versionChoice === 'choose' && !vm.cp.version.versionId);
            default:
                return true;
            }
        }

        function isSystemDevContactInfoValid () {
            vm.systemRequirements = [];
            if ((vm.developerChoice === 'create')
                || (vm.developer
                    && !vm.isBlank(vm.developer.name)
                    && !vm.isBlank(vm.developer.website)
                    && (vm.developer.contact && !vm.isBlank(vm.developer.contact.fullName) && !vm.isBlank(vm.developer.contact.email) && !vm.isBlank(vm.developer.contact.phoneNumber))
                    && (vm.developer.address && !vm.isBlank(vm.developer.address.line1) && !vm.isBlank(vm.developer.address.city) && !vm.isBlank(vm.developer.address.state) && !vm.isBlank(vm.developer.address.zipcode))
                    && (vm.getAttestationForCurrentSystemDeveloper())
                    && (!vm.isBlank(vm.getAttestationForCurrentSystemDeveloper().transparencyAttestation)))) {
                return true;
            }
            vm.populateDeveloperSystemRequirements();
            return false;
        }

        function populateDeveloperSystemRequirements () {
            if (vm.developer) {
                const DOES_NOT_EXIST_MSG = ' does not yet exist in the system.'
                const EXISTS_MSG = ' exists in the system.'
                const PLEASE_SAVE_MSG = ' Please select \'Save as Developer Information\' to continue.';
                if (vm.isBlank(vm.developer.name)) {
                    vm.systemRequirements.push('A developer name' + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                }
                if (vm.isBlank(vm.developer.website)) {
                    vm.systemRequirements.push('A developer website' + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                }
                if (vm.developer.contact) {
                    if (vm.isBlank(vm.developer.contact.fullName) || vm.isBlank(vm.developer.contact.email)
                        || vm.isBlank(vm.developer.contact.phoneNumber)) {
                        vm.systemRequirements.push('At least one type of required developer contact information'
                                                   + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                    }
                } else {
                    vm.systemRequirements.push('None of the required developer contact information'
                                               + EXISTS_MSG + PLEASE_SAVE_MSG);
                }
                if (vm.developer.address) {
                    if (vm.isBlank(vm.developer.address.line1) || vm.isBlank(vm.developer.address.city)
                        || vm.isBlank(vm.developer.address.state) || vm.isBlank(vm.developer.address.zipcode)) {
                        vm.systemRequirements.push('At least one type of required developer address information'
                                                   + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                    }
                } else {
                    vm.systemRequirements.push('None of the required developer address information'
                                               + EXISTS_MSG + PLEASE_SAVE_MSG);
                }
                if ((!vm.getAttestationForCurrentSystemDeveloper() || vm.isBlank(vm.getAttestationForCurrentSystemDeveloper().transparencyAttestation)) && !vm.isOn('effective-rule-date')) {
                    vm.systemRequirements.push('A transparency attestation' + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                }
            }
        }

        function getAttestationForCurrentSystemDeveloper () {
            if (vm.developer && vm.developer.transparencyAttestations) {
                let matchingAttestationObj = vm.developer.transparencyAttestations.find(function (curAttestationObj) {
                    return curAttestationObj.acbName === vm.cp.certifyingBody.name;
                });
                return matchingAttestationObj ? matchingAttestationObj.attestation : undefined;
            }
            return null;
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function loadFamily () {
            if (vm.product && vm.product.productId) {
                networkService.getRelatedListings(vm.product.productId)
                    .then(function (family) {
                        vm.resources.relatedListings = family.filter(function (item) { return item.edition === '2015' });
                    });
            }
        }
    }
})();
