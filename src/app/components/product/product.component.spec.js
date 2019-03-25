(() => {
    'use strict';

    describe('the Product component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            product: {
                productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
                ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552570509025}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552505343043}],
            },
            versions: [
                { name: 'a version' },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.product = mock.product;
                scope.canEdit = true;
                scope.canMerge = true;
                scope.canSplit = true;
                scope.onEdit = jasmine.createSpy('onEdit');
                scope.onSplit = jasmine.createSpy('onSplit');
                scope.versions = mock.versions;
                scope.showVersions = false;

                el = angular.element('<chpl-product product="product" can-edit="canEdit" can-merge="canMerge" can-split="canSplit" on-edit="onEdit()" on-split="onSplit()" versions="versions" show-versions="showVersions"></chpl-product>');

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
        });
    });
})();
