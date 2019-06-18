(() => {
    'use strict';

    fdescribe('the Complaints component', () => {
        var $compile, $log, $q, ctrl, el, networkService, scope;

        let complaintTypes = {
            data: [
                { id: 1, name: 'developer'},
                { id: 2, name: 'provider'},
            ],
        };

        let complaintStatusTypes = {
            data: [
                { id: 1, name: 'open'},
                { id: 2, name: 'closed'},
            ],
        };

        let certBodies = [
            { id: 1, name: 'Drummond'},
            { id: 2, name: 'SLI'},
        ];

        let complaints = {
            results: [
                { id: 1, receivedDate: 1490631434315},
                { id: 2, receivedDate: 1490631434315},
            ],
        };

        let allCps = [
            {'id': 296,'chplProductNumber': 'CHP-022218','edition': '2014','atl': null,'acb': 'UL LLC','acbCertificationId': 'IG-3138-14-0008','practiceType': 'Ambulatory','developer': 'Systemedx Inc','product': '2013 Systemedx Clinical Navigator','version': '2013.12','certificationDate': 1396497600000,'certificationStatus': 'Active','surveillanceCount': 1,'openNonconformityCount': 0,'closedNonconformityCount': 0,'previousDevelopers': null,'criteriaMet': '170.314 (a)(1)â˜º170.314 (a)(10)â˜º170.314 (a)(11)â˜º170.314 (a)(12)â˜º170.314 (a)(13)â˜º170.314 (a)(14)â˜º170.314 (a)(15)â˜º170.314 (a)(2)â˜º170.314 (a)(3)â˜º170.314 (a)(4)â˜º170.314 (a)(5)â˜º170.314 (a)(6)â˜º170.314 (a)(7)â˜º170.314 (a)(8)â˜º170.314 (a)(9)â˜º170.314 (b)(1)â˜º170.314 (b)(2)â˜º170.314 (b)(3)â˜º170.314 (b)(4)â˜º170.314 (b)(5)(A)â˜º170.314 (b)(7)â˜º170.314 (c)(1)â˜º170.314 (c)(2)â˜º170.314 (c)(3)â˜º170.314 (d)(1)â˜º170.314 (d)(2)â˜º170.314 (d)(3)â˜º170.314 (d)(4)â˜º170.314 (d)(5)â˜º170.314 (d)(6)â˜º170.314 (d)(7)â˜º170.314 (d)(8)â˜º170.314 (e)(1)â˜º170.314 (e)(2)â˜º170.314 (e)(3)â˜º170.314 (f)(1)â˜º170.314 (f)(2)â˜º170.314 (f)(3)â˜º170.314 (g)(2)â˜º170.314 (g)(3)â˜º170.314 (g)(4)','cqmsMet': 'CMS117â˜ºCMS123â˜ºCMS124â˜ºCMS125â˜ºCMS126â˜ºCMS127â˜ºCMS130â˜ºCMS131â˜ºCMS138â˜ºCMS146â˜ºCMS147â˜ºCMS155â˜ºCMS156â˜ºCMS165â˜ºCMS166â˜ºCMS50â˜ºCMS56â˜ºCMS66â˜ºCMS68â˜ºCMS69','mainSearch': 'Systemedx Inc|2013 Systemedx Clinical Navigator|IG-3138-14-0008|CHP-022218','surveillance': '{\'surveillanceCount\':1,\'openNonconformityCount\':0,\'closedNonconformityCount\':0}'},
            {'id': 4708,'chplProductNumber': 'CHP-022844','edition': '2014','atl': null,'acb': 'Drummond Group','acbCertificationId': '05082014-2337-5','practiceType': 'Ambulatory','developer': 'VIPA Health Solutions, LLC','product': '24/7 smartEMR','version': '6.0','certificationDate': 1399521600000,'certificationStatus': 'Active','surveillanceCount': 0,'openNonconformityCount': 0,'closedNonconformityCount': 0,'previousDevelopers': null,'criteriaMet': '170.314 (a)(1)â˜º170.314 (a)(10)â˜º170.314 (a)(11)â˜º170.314 (a)(12)â˜º170.314 (a)(13)â˜º170.314 (a)(14)â˜º170.314 (a)(15)â˜º170.314 (a)(2)â˜º170.314 (a)(3)â˜º170.314 (a)(4)â˜º170.314 (a)(5)â˜º170.314 (a)(6)â˜º170.314 (a)(7)â˜º170.314 (a)(8)â˜º170.314 (a)(9)â˜º170.314 (b)(1)â˜º170.314 (b)(2)â˜º170.314 (b)(3)â˜º170.314 (b)(4)â˜º170.314 (b)(5)(A)â˜º170.314 (b)(7)â˜º170.314 (c)(1)â˜º170.314 (c)(2)â˜º170.314 (c)(3)â˜º170.314 (d)(1)â˜º170.314 (d)(2)â˜º170.314 (d)(3)â˜º170.314 (d)(4)â˜º170.314 (d)(5)â˜º170.314 (d)(6)â˜º170.314 (d)(7)â˜º170.314 (d)(8)â˜º170.314 (e)(1)â˜º170.314 (e)(2)â˜º170.314 (e)(3)â˜º170.314 (f)(1)â˜º170.314 (f)(2)â˜º170.314 (f)(3)â˜º170.314 (f)(5)â˜º170.314 (g)(2)â˜º170.314 (g)(3)â˜º170.314 (g)(4)','cqmsMet': 'CMS138â˜ºCMS156â˜ºCMS165â˜ºCMS166â˜ºCMS2â˜ºCMS50â˜ºCMS68â˜ºCMS69â˜ºCMS90','mainSearch': 'VIPA Health Solutions, LLC|24/7 smartEMR|05082014-2337-5|CHP-022844','surveillance': '{\'surveillanceCount\':0,\'openNonconformityCount\':0,\'closedNonconformityCount\':0}'},
            {'id': 470,'chplProductNumber': 'CHP-026059','edition': '2014','atl': null,'acb': 'UL LLC','acbCertificationId': 'IG-2697-15-0020','practiceType': 'Ambulatory','developer': 'DrScribe, Inc.','product': '365EHR','version': '4.0.14','certificationDate': 1430798400000,'certificationStatus': 'Active','surveillanceCount': 2,'openNonconformityCount': 2,'closedNonconformityCount': 0,'previousDevelopers': null,'criteriaMet': '170.314 (a)(1)â˜º170.314 (a)(10)â˜º170.314 (a)(11)â˜º170.314 (a)(12)â˜º170.314 (a)(13)â˜º170.314 (a)(14)â˜º170.314 (a)(15)â˜º170.314 (a)(2)â˜º170.314 (a)(3)â˜º170.314 (a)(4)â˜º170.314 (a)(5)â˜º170.314 (a)(6)â˜º170.314 (a)(7)â˜º170.314 (a)(8)â˜º170.314 (a)(9)â˜º170.314 (b)(1)â˜º170.314 (b)(2)â˜º170.314 (b)(3)â˜º170.314 (b)(4)â˜º170.314 (b)(5)(A)â˜º170.314 (b)(7)â˜º170.314 (c)(1)â˜º170.314 (c)(2)â˜º170.314 (c)(3)â˜º170.314 (d)(1)â˜º170.314 (d)(2)â˜º170.314 (d)(3)â˜º170.314 (d)(4)â˜º170.314 (d)(5)â˜º170.314 (d)(6)â˜º170.314 (d)(7)â˜º170.314 (d)(8)â˜º170.314 (e)(1)â˜º170.314 (e)(2)â˜º170.314 (e)(3)â˜º170.314 (f)(1)â˜º170.314 (f)(2)â˜º170.314 (f)(3)â˜º170.314 (f)(5)â˜º170.314 (f)(6)â˜º170.314 (g)(2)â˜º170.314 (g)(3)â˜º170.314 (g)(4)','cqmsMet': 'CMS122â˜ºCMS124â˜ºCMS125â˜ºCMS126â˜ºCMS127â˜ºCMS138â˜ºCMS165â˜ºCMS166â˜ºCMS68â˜ºCMS69','mainSearch': 'DrScribe, Inc.|365EHR|IG-2697-15-0020|CHP-026059','surveillance': '{\'surveillanceCount\':2,\'openNonconformityCount\':2,\'closedNonconformityCount\':0}'},
        ];

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getComplaints = jasmine.createSpy('getComplaints');
                    $delegate.getComplaintTypes = jasmine.createSpy('getComplaintTypes');
                    $delegate.getComplaintStatusTypes = jasmine.createSpy('getComplaintStatusTypes');
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    $delegate.deleteComplaint = jasmine.createSpy('deleteComplaint');
                    $delegate.updateComplaint = jasmine.createSpy('updateComplaint');
                    $delegate.createComplaint = jasmine.createSpy('createComplaint');
                    $delegate.getAll = jasmine.createSpy('getAll');
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;

                networkService.getComplaints.and.returnValue($q.when(complaints));
                networkService.getComplaintTypes.and.returnValue($q.when(complaintTypes));
                networkService.getComplaintStatusTypes.and.returnValue($q.when(complaintStatusTypes));
                networkService.getAcbs.and.returnValue($q.when(certBodies));
                networkService.deleteComplaint.and.returnValue($q.when({status: 200}));
                networkService.updateComplaint.and.returnValue($q.when(complaints[0]));
                networkService.createComplaint.and.returnValue($q.when(complaints[0]));
                networkService.getAll.and.returnValue($q.when({'results': angular.copy(allCps)}));

                scope = $rootScope.$new();

                el = angular.element('<chpl-surveillance-complaints></chpl-surveillance-complaints>');

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

            it('should delete a complaint', () => {
                let complaint = {id: 1};
                ctrl.deleteComplaint(complaint);
                expect(networkService.deleteComplaint).toHaveBeenCalled();
                expect(ctrl.complaint).toEqual({});
                expect(ctrl.isEditing).toBe(false);
            });

            it('should select a complaint', () => {
                let complaint = {id: 1};
                ctrl.selectComplaint(complaint);
                expect(ctrl.isEditing).toBe(true);
                expect(ctrl.complaint).toEqual(complaint);
            });

            it('should save/update a complaint', () => {
                let complaint = {id: 1, formattedReceivedDate: new Date('2019-06-04')};
                ctrl.isEditing = true;
                ctrl.saveComplaint(complaint);
                expect(complaint.receivedDate).toBeDefined();
                expect(networkService.updateComplaint).toHaveBeenCalledWith(complaint);
            });

            it('should save/create a complaint', () => {
                let complaint = {formattedReceivedDate: new Date('2019-06-04')};
                ctrl.isEditing = true;
                ctrl.saveComplaint(complaint);
                expect(complaint.receivedDate).toBeDefined();
                expect(networkService.createComplaint).toHaveBeenCalledWith(complaint);
            });

            it('should cancel current editing and go to select mode', () => {
                ctrl.isEditing = true;
                ctrl.cancelEdit();
                expect(ctrl.isEditing).toEqual(false);
            });

            it('should allow for adding a new complaint', () => {
                ctrl.complaint = {id: 5};
                ctrl.displayAddComplaint();
                expect(ctrl.complaint).toEqual({});
                expect(ctrl.isEditing).toEqual(true);
            });

            it('should be able to fetch all "relevant" complaints', () => {
                ctrl.refreshComplaints();
                expect(networkService.getComplaints).toHaveBeenCalled();
                expect(ctrl.complaints.length).toBe(2);
            });

            it('should be able to fetch all complaint types', () => {
                ctrl.refreshComplaintTypes();
                expect(networkService.getComplaintTypes).toHaveBeenCalled();
                expect(ctrl.complaintTypes.length).toBe(2);
            });

            it('should be able to fetch all complaint status types', () => {
                ctrl.refreshComplaintStatusTypes();
                expect(networkService.getComplaintStatusTypes).toHaveBeenCalled();
                expect(ctrl.complaintStatusTypes.length).toBe(2);
            });

            it('should be able to fetch all listings', () => {
                ctrl.refreshListings();
                expect(networkService.getAll).toHaveBeenCalled();
                expect(ctrl.listings.length).toBe(3);
            });
        });
    });
})();
