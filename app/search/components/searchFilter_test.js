;(function () {
    'use strict';

    describe('[app.search module] [search filter]', function () {

        var $filter;
        var $rootScope;
        var $log;
        beforeEach(module('app.search'));
        beforeEach(function () {
            inject(function (_$filter_, _$rootScope_, _$log_) {
                $filter = _$filter_;
                $rootScope = _$rootScope_;
                $log = _$log_;
            });
            $rootScope.certFilters = Object.create(null);
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        var item1 = {
            vendor: 'Vendor1',
            product: 'Product1',
            edition: 2011,
            certDate: '2011-01-01',
            classification: 'Complete EHR',
            certs: [{
                title: '2011 Certifications',
                certs: [{title: '2011 Cert 1', isActive: true} , {title: '2011 Cert 2', isActive: false}]
            },{
                title: '2014 Certifications',
                certs: [{title: '2014 Cert 1', isActive: false} , {title: '2014 Cert 2', isActive: false}]
            }]
        };
        var item2 = {
            vendor: 'Vendor2',
            product: 'Product2',
            edition: 2014,
            certDate: '2014-01-01',
            classification: 'Modular EHR',
            certs: [{
                title: '2011 Certifications',
                certs: [{title: '2011 Cert 1', isActive: false} , {title: '2011 Cert 2', isActive: true}]
            },{
                title: '2014 Certifications',
                certs: [{title: '2014 Cert 1', isActive: true} , {title: '2014 Cert 2', isActive: false}]
            }]
        };
        var items = [item1, item2];

        it('should filter out Vendor2 when vendor.value is "Vendor1"', function () {
            var result = $filter('tableFilter')(items, {vendor: 'Vendor1'});
            expect(result).toEqual([item1]);
        });

        it('should filter out both items when edition.value is 2000', function () {
            var result = $filter('tableFilter')(items, {edition: 2000});
            expect(result).toEqual([]);
        });

        it('should filter out item2 if 2011 Cert 1 is required', function () {
            $rootScope.certFilters['2011 Certifications:2011 Cert 1'] = true;
            var result = $filter('tableFilter')(items, {});
            expect(result).toEqual([item1]);
        });

        it('should filter both items out if certs are asked that aren\'t found', function () {
            $rootScope.certFilters['2011 Certifications:2011 Cert 1'] = true;
            $rootScope.certFilters['2014 Certifications:2014 Cert 2'] = true;
            var result = $filter('tableFilter')(items, {});
            expect(result).toEqual([]);
        });

        it('should filter both items out if certs are asked that don\'t exist', function () {
            $rootScope.certFilters['ThisCertDoesNot:Exist'] = true;
            var result = $filter('tableFilter')(items, {});
            expect(result).toEqual([]);
        });
    });
})();
