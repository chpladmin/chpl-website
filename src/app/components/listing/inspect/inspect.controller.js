(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('InspectController', InspectController);

    /** @ngInject */
    function InspectController ($log, $uibModal, $uibModalInstance, developers, featureFlags, inspectingCp, isAcbAdmin, isChplAdmin, networkService, resources, utilService) {
        var vm = this;

        vm.loadDev = loadDev;
        vm.selectInspectingDeveloper = selectInspectingDeveloper;
        vm.saveInspectingDeveloper = saveInspectingDeveloper;

        vm.selectInspectingProduct = selectInspectingProduct;
        vm.setProductChoice = setProductChoice;

        vm.selectInspectingVersion = selectInspectingVersion;
        vm.setVersionChoice = setVersionChoice;

        vm.confirm = confirm;
        vm.reject = reject;
        vm.editCertifiedProduct = editCertifiedProduct;

        vm.next = next;
        vm.previous = previous;
        vm.isDisabled = isDisabled;

        vm.cancel = cancel;
        vm.ternaryFilter = utilService.ternaryFilter;
        vm.checkQmsBoolean = checkQmsBoolean;

        vm.certificationStatus = utilService.certificationStatus;
        vm.isBlank = utilService.isBlank;
        vm.getAttestationStringForCurrentSystemDeveloper = getAttestationStringForCurrentSystemDeveloper;
        vm.populateDeveloperSystemRequirements = populateDeveloperSystemRequirements;
        vm.isTransparencyAttestationEditable = isTransparencyAttestationEditable;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.cp = angular.copy(inspectingCp);
            vm.stage = 'dev';

            vm.developers = developers;
            vm.developerChoice = 'choose';
            vm.loadDev();

            vm.products = [];
            vm.productChoice = 'choose';

            vm.versions = [];
            vm.versionChoice = 'choose';

            vm.errorMessages = [];
            vm.systemRequirements = [];
            vm.isAcbAdmin = isAcbAdmin;
            vm.isChplAdmin = isChplAdmin;
            vm.resources = resources;
            vm.statuses = resources.statuses;
            for (var i = 0; i < vm.statuses.length; i++) {
                if (vm.statuses[i].name === 'Pending') {
                    vm.cp.certificationStatus = vm.statuses[i];
                    break;
                }
            }
            if (!vm.cp.developer.country) {
                vm.cp.developer.country = 'USA';
            }
            vm.featureFlags = featureFlags;
        }

        function loadDev () {
            if (vm.cp.developer && vm.cp.developer.developerId) {
                networkService.getDeveloper(vm.cp.developer.developerId)
                    .then(function (result) {
                        vm.developer = result;
                    });
            }
        }

        function selectInspectingDeveloper () {
            vm.cp.developer.developerId = vm.developerSelect.developerId;
            vm.loadDev();
        }

        function saveInspectingDeveloper () {
            var dev = {
                developer: {
                    address: vm.cp.developer.address,
                    contact: vm.cp.developer.contact,
                    developerCode: vm.developer.developerCode,
                    developerId: vm.cp.developer.developerId,
                    name: vm.cp.developer.name,
                    status: vm.developer.status,
                    statusEvents: vm.developer.statusEvents,
                    transparencyAttestations: [{acbId: vm.cp.certifyingBody.id, acbName: vm.cp.certifyingBody.name, attestation: vm.cp.transparencyAttestation}],
                    website: vm.cp.developer.website,
                },
                developerIds: [vm.cp.developer.developerId],
            };
            if (!dev.developer.address.country) {
                dev.developer.address.country = 'USA';
            }
            networkService.updateDeveloper(dev)
                .then(function () {
                    vm.loadDev();
                });
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

        function editCertifiedProduct () {
            // if listing-edit is off, use this modal. If it's on, we'll need a new thing
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/certifiedProduct/listing/edit.html',
                controller: 'EditCertifiedProductController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    activeCP: function () { return vm.cp; },
                    isAcbAdmin: function () { return vm.isAcbAdmin; },
                    isChplAdmin: function () { return vm.isChplAdmin; },
                    resources: function () { return vm.resources; },
                    workType: function () { return 'confirm'; },
                },
            });
            vm.editModalInstance.result.then(function (result) {
                vm.cp = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                }
            });
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
                || ((vm.developer && !vm.isBlank(vm.developer.name) && !vm.isBlank(vm.developer.website))
                && (vm.developer.contact && !vm.isBlank(vm.developer.contact.fullName) && !vm.isBlank(vm.developer.contact.email)
                && !vm.isBlank(vm.developer.contact.phoneNumber))
                && (vm.developer.address && !vm.isBlank(vm.developer.address.line1) && !vm.isBlank(vm.developer.address.city)
                && !vm.isBlank(vm.developer.address.state) && !vm.isBlank(vm.developer.address.zipcode))
                && (!vm.isBlank(vm.getAttestationStringForCurrentSystemDeveloper())))) {
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
                if (vm.isBlank(vm.getAttestationStringForCurrentSystemDeveloper())) {
                    vm.systemRequirements.push('A transparency attestation' + DOES_NOT_EXIST_MSG + PLEASE_SAVE_MSG);
                }
            }
        }

        function getAttestationStringForCurrentSystemDeveloper () {
            if (vm.developer && vm.developer.transparencyAttestations) {
                let matchingAttestationObj = vm.developer.transparencyAttestations.find(function (curAttestationObj) {
                    return curAttestationObj.acbName === vm.cp.certifyingBody.name;
                });
                return matchingAttestationObj ? matchingAttestationObj.attestation : undefined;
            }
            return null;
        }

        function isTransparencyAttestationEditable () {
            if (vm.featureFlags.isOn('effective-rule-date-plus-one-week')) {
                return !vm.isAcbAdmin;
            }
            return true;
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function checkQmsBoolean (qms) {
            if (qms === null) {
                return vm.cp.qmsStandards.length > 0 ? 'True' : 'False';
            } else {
                return vm.cp.hasQms ? 'True' : 'False';
            }
        }

        ////////////////////////////////////////////////////////////////////

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
