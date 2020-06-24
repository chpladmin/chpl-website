(() => {
    'use strict';

    describe('the Surveillance Complaint component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            complaint: {
                certificationBody: {
                    name: 'ACB',
                    id: 1,
                },
            },
            allCps: [
                {'id': 296,'chplProductNumber': 'CHP-022218','edition': '2014','atl': null,'acb': 'UL LLC','acbCertificationId': 'IG-3138-14-0008','practiceType': 'Ambulatory','developer': 'Systemedx Inc','product': '2013 Systemedx Clinical Navigator','version': '2013.12','certificationDate': 1396497600000,'certificationStatus': 'Active','surveillanceCount': 1,'openNonconformityCount': 0,'closedNonconformityCount': 0,'previousDevelopers': null,'criteriaMet': '170.314 (a)(1)â˜º170.314 (a)(10)â˜º170.314 (a)(11)â˜º170.314 (a)(12)â˜º170.314 (a)(13)â˜º170.314 (a)(14)â˜º170.314 (a)(15)â˜º170.314 (a)(2)â˜º170.314 (a)(3)â˜º170.314 (a)(4)â˜º170.314 (a)(5)â˜º170.314 (a)(6)â˜º170.314 (a)(7)â˜º170.314 (a)(8)â˜º170.314 (a)(9)â˜º170.314 (b)(1)â˜º170.314 (b)(2)â˜º170.314 (b)(3)â˜º170.314 (b)(4)â˜º170.314 (b)(5)(A)â˜º170.314 (b)(7)â˜º170.314 (c)(1)â˜º170.314 (c)(2)â˜º170.314 (c)(3)â˜º170.314 (d)(1)â˜º170.314 (d)(2)â˜º170.314 (d)(3)â˜º170.314 (d)(4)â˜º170.314 (d)(5)â˜º170.314 (d)(6)â˜º170.314 (d)(7)â˜º170.314 (d)(8)â˜º170.314 (e)(1)â˜º170.314 (e)(2)â˜º170.314 (e)(3)â˜º170.314 (f)(1)â˜º170.314 (f)(2)â˜º170.314 (f)(3)â˜º170.314 (g)(2)â˜º170.314 (g)(3)â˜º170.314 (g)(4)','cqmsMet': 'CMS117â˜ºCMS123â˜ºCMS124â˜ºCMS125â˜ºCMS126â˜ºCMS127â˜ºCMS130â˜ºCMS131â˜ºCMS138â˜ºCMS146â˜ºCMS147â˜ºCMS155â˜ºCMS156â˜ºCMS165â˜ºCMS166â˜ºCMS50â˜ºCMS56â˜ºCMS66â˜ºCMS68â˜ºCMS69','mainSearch': 'Systemedx Inc|2013 Systemedx Clinical Navigator|IG-3138-14-0008|CHP-022218','surveillance': '{\'surveillanceCount\':1,\'openNonconformityCount\':0,\'closedNonconformityCount\':0}'},
                {'id': 4708,'chplProductNumber': 'CHP-022844','edition': '2014','atl': null,'acb': 'Drummond Group','acbCertificationId': '05082014-2337-5','practiceType': 'Ambulatory','developer': 'VIPA Health Solutions, LLC','product': '24/7 smartEMR','version': '6.0','certificationDate': 1399521600000,'certificationStatus': 'Active','surveillanceCount': 0,'openNonconformityCount': 0,'closedNonconformityCount': 0,'previousDevelopers': null,'criteriaMet': '170.314 (a)(1)â˜º170.314 (a)(10)â˜º170.314 (a)(11)â˜º170.314 (a)(12)â˜º170.314 (a)(13)â˜º170.314 (a)(14)â˜º170.314 (a)(15)â˜º170.314 (a)(2)â˜º170.314 (a)(3)â˜º170.314 (a)(4)â˜º170.314 (a)(5)â˜º170.314 (a)(6)â˜º170.314 (a)(7)â˜º170.314 (a)(8)â˜º170.314 (a)(9)â˜º170.314 (b)(1)â˜º170.314 (b)(2)â˜º170.314 (b)(3)â˜º170.314 (b)(4)â˜º170.314 (b)(5)(A)â˜º170.314 (b)(7)â˜º170.314 (c)(1)â˜º170.314 (c)(2)â˜º170.314 (c)(3)â˜º170.314 (d)(1)â˜º170.314 (d)(2)â˜º170.314 (d)(3)â˜º170.314 (d)(4)â˜º170.314 (d)(5)â˜º170.314 (d)(6)â˜º170.314 (d)(7)â˜º170.314 (d)(8)â˜º170.314 (e)(1)â˜º170.314 (e)(2)â˜º170.314 (e)(3)â˜º170.314 (f)(1)â˜º170.314 (f)(2)â˜º170.314 (f)(3)â˜º170.314 (f)(5)â˜º170.314 (g)(2)â˜º170.314 (g)(3)â˜º170.314 (g)(4)','cqmsMet': 'CMS138â˜ºCMS156â˜ºCMS165â˜ºCMS166â˜ºCMS2â˜ºCMS50â˜ºCMS68â˜ºCMS69â˜ºCMS90','mainSearch': 'VIPA Health Solutions, LLC|24/7 smartEMR|05082014-2337-5|CHP-022844','surveillance': '{\'surveillanceCount\':0,\'openNonconformityCount\':0,\'closedNonconformityCount\':0}'},
                {'id': 470,'chplProductNumber': 'CHP-026059','edition': '2014','atl': null,'acb': 'UL LLC','acbCertificationId': 'IG-2697-15-0020','practiceType': 'Ambulatory','developer': 'DrScribe, Inc.','product': '365EHR','version': '4.0.14','certificationDate': 1430798400000,'certificationStatus': 'Active','surveillanceCount': 2,'openNonconformityCount': 2,'closedNonconformityCount': 0,'previousDevelopers': null,'criteriaMet': '170.314 (a)(1)â˜º170.314 (a)(10)â˜º170.314 (a)(11)â˜º170.314 (a)(12)â˜º170.314 (a)(13)â˜º170.314 (a)(14)â˜º170.314 (a)(15)â˜º170.314 (a)(2)â˜º170.314 (a)(3)â˜º170.314 (a)(4)â˜º170.314 (a)(5)â˜º170.314 (a)(6)â˜º170.314 (a)(7)â˜º170.314 (a)(8)â˜º170.314 (a)(9)â˜º170.314 (b)(1)â˜º170.314 (b)(2)â˜º170.314 (b)(3)â˜º170.314 (b)(4)â˜º170.314 (b)(5)(A)â˜º170.314 (b)(7)â˜º170.314 (c)(1)â˜º170.314 (c)(2)â˜º170.314 (c)(3)â˜º170.314 (d)(1)â˜º170.314 (d)(2)â˜º170.314 (d)(3)â˜º170.314 (d)(4)â˜º170.314 (d)(5)â˜º170.314 (d)(6)â˜º170.314 (d)(7)â˜º170.314 (d)(8)â˜º170.314 (e)(1)â˜º170.314 (e)(2)â˜º170.314 (e)(3)â˜º170.314 (f)(1)â˜º170.314 (f)(2)â˜º170.314 (f)(3)â˜º170.314 (f)(5)â˜º170.314 (f)(6)â˜º170.314 (g)(2)â˜º170.314 (g)(3)â˜º170.314 (g)(4)','cqmsMet': 'CMS122â˜ºCMS124â˜ºCMS125â˜ºCMS126â˜ºCMS127â˜ºCMS138â˜ºCMS165â˜ºCMS166â˜ºCMS68â˜ºCMS69','mainSearch': 'DrScribe, Inc.|365EHR|IG-2697-15-0020|CHP-026059','surveillance': '{\'surveillanceCount\':2,\'openNonconformityCount\':2,\'closedNonconformityCount\':0}'},
            ],
            editions: [
                {id: 3,name: '2015',description: null},
                {id: 2,name: '2014',description: null},
                {id: 1,name: '2011',description: null},
            ],
            criteria: [
                {id: 14,number: '170.315 (a)(14)',title: 'Implantable Device List',certificationEditionId: 3,certificationEdition: '2015',description: null},
                {id: 39,number: '170.315 (d)(11)',title: 'Accounting of Disclosures',certificationEditionId: 3,certificationEdition: '2015',description: null},
                {id: 104,number: '170.314 (e)(2)',title: 'Ambulatory setting only -clinical summary',certificationEditionId: 2,certificationEdition: '2014',description: null},
                {id: 153,number: '170.304 (i)',title: 'Exchange clinical information and patient summary record',certificationEditionId: 1,certificationEdition: '2011',description: null},
                {id: 96,number: '170.314 (d)(3)',title: 'Audit report(s)',certificationEditionId: 2,certificationEdition: '2014',description: null},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.services', 'chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;

                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                scope.complaint = mock.complaint;
                scope.listings = mock.allCps;
                scope.criteria = mock.criteria;
                scope.editions = mock.editions;
                scope.complaintTypes = [];
                scope.certificationBodies = [];
                scope.isEditing = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onSave = jasmine.createSpy('onSave');
                scope.onSelect = jasmine.createSpy('onSelect');
                scope.onDelete = jasmine.createSpy('onDelete');
                scope.isOn = jasmine.createSpy('isOn');
                scope.isOn.and.returnValue(true);

                el = angular.element('<chpl-surveillance-complaint complaint="complaint" listings="listings" complaint-types="complaintTypes" certification-bodies="certificationBodies" criteria="criteria" editions="editions" on-cancel="onCancel()" on-save="onSave(complaint)" on-delete="onDelete(complaint)" on-select="onSelect(complaint)"></chpl-surveillance-complaint>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should call onCancel when cancelled', () => {
                ctrl.cancelEdit();
                expect(scope.onCancel).toHaveBeenCalled();
            });

            it('should send data back on save ', () => {
                let complaint = {id: 1};
                ctrl.saveComplaint(complaint);
                expect(scope.onSave).toHaveBeenCalledWith(complaint);
            });

            it('should send data back to delete ', () => {
                let complaint = {id: 1};
                ctrl.deleteComplaint(complaint);
                expect(scope.onDelete).toHaveBeenCalledWith(complaint);
            });

            it('should filter the listings based on the acb', () => {
                ctrl.complaint.certificationBody.name = 'UL LLC';
                ctrl.filterListingsBasedOnSelectedAcb();
                expect(ctrl.filteredListings.length).toBe(2);
            });

            it('should filter the criteria based on the edition', () => {
                ctrl.selectEdition(mock.editions[0]);
                expect(ctrl.edition).toEqual(mock.editions[0]);
                expect(ctrl.filteredCriteria.length).toBe(2);
            });

            describe('utility function startsWith', () => {
                it('should check if string starts with another string', () => {
                    expect(ctrl.startsWith('This is a test', 'Thi')).toEqual(true);
                });
                it('should check if string does not start with another string', () => {
                    expect(ctrl.startsWith('This is a test', 'aaa')).toEqual(false);
                });
            });
        });
    });
})();
