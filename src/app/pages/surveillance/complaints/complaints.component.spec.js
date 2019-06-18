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
            {'id': 296,'chplProductNumber': 'CHP-022218','acb': 'UL LLC'},
            {'id': 4708,'chplProductNumber': 'CHP-022844','acb': 'Drummond Group'},
            {'id': 470,'chplProductNumber': 'CHP-026059','acb': 'UL LLC'},
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
                    $delegate.getCollection = jasmine.createSpy('getCollection');
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
                networkService.getCollection.and.returnValue($q.when({'results': angular.copy(allCps)}));

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
                expect(networkService.getCollection).toHaveBeenCalled();
                expect(ctrl.listings.length).toBe(3);
            });
        });
    });
})();
