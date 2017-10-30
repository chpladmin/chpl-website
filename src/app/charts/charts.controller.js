(function () {
    'use strict';

    angular.module('chpl.charts')
        .controller('ChartsController', ChartsController);

    /** @ngInclude */
    function ChartsController ($log, networkService) {
        var vm = this;

        vm.applyFilter = applyFilter;
        vm.toggleSeries = toggleSeries;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.statistics = [];
            vm.statisticTypes = [];
            networkService.getStatisticTypes().then(function (types) {
                vm.statisticTypes = types;
            });
            networkService.getStatistics().then(function (stats) {
                vm.statistics = stats;
                _parseData();
                applyFilter();
            }, function () {
                loadFakeData();
                applyFilter();
            });
            vm.charts = {
                uniqueProducts: {
                    type: 'LineChart',
                    data: {
                        cols: [{ label: 'Date', type: 'date' }],
                    },
                    options: {
                        title: 'Unique Products over Time',
                        colors: ['#00f', '#090', '#c00', '#d90'],
                        defaultColors: ['#00f', '#090', '#c00', '#d90'],
                        isStacked: 'true',
                        fill: 20,
                        displayExactValues: true,
                        vAxis: {
                            title: 'Unique Products',
                        },
                        hAxis: {
                            title: 'Date',
                        },
                    },
                    view: {columns: [0, 1, 2, 3, 4]},
                },
                criteria2011: {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Criteria', type: 'string'},
                            { label: 'Number of Products', type: 'number'},
                        ],
                        rows: [
                            {c: [{v: '170.302 (a)'},{v: 2963}]},
                            {c: [{v: '170.302 (b)'},{v: 2945}]},
                            {c: [{v: '170.302 (c)'},{v: 3054}]},
                            {c: [{v: '170.302 (d)'},{v: 3068}]},
                            {c: [{v: '170.302 (e)'},{v: 3100}]},
                            {c: [{v: '170.302 (f)(1)'},{v: 3022}]},
                            {c: [{v: '170.302 (f)(2)'},{v: 3022}]},
                            {c: [{v: '170.302 (f)(3)'},{v: 3022}]},
                            {c: [{v: '170.302 (g)'},{v: 3150}]},
                            {c: [{v: '170.302 (h)'},{v: 2965}]},
                            {c: [{v: '170.302 (i)'},{v: 2902}]},
                            {c: [{v: '170.302 (j)'},{v: 3012}]},
                            {c: [{v: '170.302 (k)'},{v: 2805}]},
                            {c: [{v: '170.302 (l)'},{v: 2340}]},
                            {c: [{v: '170.302 (m)'},{v: 2948}]},
                            {c: [{v: '170.302 (n)'},{v: 2824}]},
                            {c: [{v: '170.302 (o)'},{v: 3881}]},
                            {c: [{v: '170.302 (p)'},{v: 3695}]},
                            {c: [{v: '170.302 (q)'},{v: 3875}]},
                            {c: [{v: '170.302 (r)'},{v: 3829}]},
                            {c: [{v: '170.302 (s)'},{v: 3848}]},
                            {c: [{v: '170.302 (t)'},{v: 3881}]},
                            {c: [{v: '170.302 (u)'},{v: 3845}]},
                            {c: [{v: '170.302 (v)'},{v: 3862}]},
                            {c: [{v: '170.302 (w)'},{v: 779}]},
                            {c: [{v: '170.304 (a)'},{v: 2951}]},
                            {c: [{v: '170.304 (b)'},{v: 2455}]},
                            {c: [{v: '170.304 (c)'},{v: 3124}]},
                            {c: [{v: '170.304 (d)'},{v: 2410}]},
                            {c: [{v: '170.304 (e)'},{v: 2908}]},
                            {c: [{v: '170.304 (f)'},{v: 2884}]},
                            {c: [{v: '170.304 (g)'},{v: 2320}]},
                            {c: [{v: '170.304 (h)'},{v: 2426}]},
                            {c: [{v: '170.304 (i)'},{v: 2795}]},
                            {c: [{v: '170.304 (j)'},{v: 2371}]},
                            {c: [{v: '170.306 (a)'},{v: 795}]},
                            {c: [{v: '170.306 (b)'},{v: 865}]},
                            {c: [{v: '170.306 (c)'},{v: 784}]},
                            {c: [{v: '170.306 (d)(1)'},{v: 766}]},
                            {c: [{v: '170.306 (d)(2)'},{v: 766}]},
                            {c: [{v: '170.306 (e)'},{v: 891}]},
                            {c: [{v: '170.306 (f)'},{v: 703}]},
                            {c: [{v: '170.306 (g)'},{v: 547}]},
                            {c: [{v: '170.306 (h)'},{v: 853}]},
                            {c: [{v: '170.306 (i)'},{v: 569}]},
                        ],
                    },
                    options: {
                        title: 'Count of 2011 Products attesting to Criteria',
                    },
                },
                criteria2014: {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Criteria', type: 'string'},
                            { label: 'Number of Products', type: 'number'},
                        ],
                        rows: [
                            {c: [{v: '170.314 (a)(1)'},{v: 2255}]},
                            {c: [{v: '170.314 (a)(2)'},{v: 2171}]},
                            {c: [{v: '170.314 (a)(3)'},{v: 2313}]},
                            {c: [{v: '170.314 (a)(4)'},{v: 2272}]},
                            {c: [{v: '170.314 (a)(5)'},{v: 2358}]},
                            {c: [{v: '170.314 (a)(6)'},{v: 2243}]},
                            {c: [{v: '170.314 (a)(7)'},{v: 2264}]},
                            {c: [{v: '170.314 (a)(8)'},{v: 2055}]},
                            {c: [{v: '170.314 (a)(9)'},{v: 2186}]},
                            {c: [{v: '170.314 (a)(10)'},{v: 2181}]},
                            {c: [{v: '170.314 (a)(11)'},{v: 2428}]},
                            {c: [{v: '170.314 (a)(12)'},{v: 2035}]},
                            {c: [{v: '170.314 (a)(13)'},{v: 2072}]},
                            {c: [{v: '170.314 (a)(14)'},{v: 2132}]},
                            {c: [{v: '170.314 (a)(15)'},{v: 2170}]},
                            {c: [{v: '170.314 (a)(16)'},{v: 431}]},
                            {c: [{v: '170.314 (a)(17)'},{v: 657}]},
                            {c: [{v: '170.314 (a)(18)'},{v: 28}]},
                            {c: [{v: '170.314 (a)(19)'},{v: 22}]},
                            {c: [{v: '170.314 (a)(20)'},{v: 18}]},
                            {c: [{v: '170.314 (b)(1)'},{v: 2136}]},
                            {c: [{v: '170.314 (b)(2)'},{v: 2123}]},
                            {c: [{v: '170.314 (b)(3)'},{v: 2056}]},
                            {c: [{v: '170.314 (b)(4)'},{v: 1964}]},
                            {c: [{v: '170.314 (b)(5)(A)'},{v: 1606}]},
                            {c: [{v: '170.314 (b)(5)(B)'},{v: 782}]},
                            {c: [{v: '170.314 (b)(6)'},{v: 312}]},
                            {c: [{v: '170.314 (b)(7)'},{v: 2017}]},
                            {c: [{v: '170.314 (b)(8)'},{v: 2}]},
                            {c: [{v: '170.314 (b)(9)'},{v: 4}]},
                            {c: [{v: '170.314 (c)(1)'},{v: 2029}]},
                            {c: [{v: '170.314 (c)(2)'},{v: 2038}]},
                            {c: [{v: '170.314 (c)(3)'},{v: 2038}]},
                            {c: [{v: '170.314 (d)(1)'},{v: 2876}]},
                            {c: [{v: '170.314 (d)(2)'},{v: 2356}]},
                            {c: [{v: '170.314 (d)(3)'},{v: 2159}]},
                            {c: [{v: '170.314 (d)(4)'},{v: 2184}]},
                            {c: [{v: '170.314 (d)(5)'},{v: 2885}]},
                            {c: [{v: '170.314 (d)(6)'},{v: 2691}]},
                            {c: [{v: '170.314 (d)(7)'},{v: 2335}]},
                            {c: [{v: '170.314 (d)(8)'},{v: 2675}]},
                            {c: [{v: '170.314 (d)(9)'},{v: 682}]},
                            {c: [{v: '170.314 (e)(1)'},{v: 2116}]},
                            {c: [{v: '170.314 (e)(2)'},{v: 1503}]},
                            {c: [{v: '170.314 (e)(3)'},{v: 1570}]},
                            {c: [{v: '170.314 (f)(1)'},{v: 2146}]},
                            {c: [{v: '170.314 (f)(2)'},{v: 1986}]},
                            {c: [{v: '170.314 (f)(3)'},{v: 1729}]},
                            {c: [{v: '170.314 (f)(4)'},{v: 367}]},
                            {c: [{v: '170.314 (f)(5)'},{v: 224}]},
                            {c: [{v: '170.314 (f)(6)'},{v: 210}]},
                            {c: [{v: '170.314 (f)(7)'},{v: 13}]},
                            {c: [{v: '170.314 (g)(1)'},{v: 751}]},
                            {c: [{v: '170.314 (g)(2)'},{v: 3308}]},
                            {c: [{v: '170.314 (g)(3)'},{v: 2587}]},
                            {c: [{v: '170.314 (g)(4)'},{v: 4822}]},
                            {c: [{v: '170.314 (h)(1)'},{v: 20}]},
                            {c: [{v: '170.314 (h)(2)'},{v: 10}]},
                            {c: [{v: '170.314 (h)(3)'},{v: 10}]},
                        ],
                    },
                    options: {
                        title: 'Count of 2014 Products attesting to Criteria',
                    },
                },
                criteria2015: {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Criteria', type: 'string'},
                            { label: 'Number of Products', type: 'number'},
                        ],
                        rows: [
                            {c: [{v: '170.315 (a)(1)'},{v: 40}]},
                            {c: [{v: '170.315 (a)(2)'},{v: 40}]},
                            {c: [{v: '170.315 (a)(3)'},{v: 40}]},
                            {c: [{v: '170.315 (a)(4)'},{v: 39}]},
                            {c: [{v: '170.315 (a)(5)'},{v: 39}]},
                            {c: [{v: '170.315 (a)(6)'},{v: 37}]},
                            {c: [{v: '170.315 (a)(7)'},{v: 40}]},
                            {c: [{v: '170.315 (a)(8)'},{v: 40}]},
                            {c: [{v: '170.315 (a)(9)'},{v: 29}]},
                            {c: [{v: '170.315 (a)(10)'},{v: 38}]},
                            {c: [{v: '170.315 (a)(11)'},{v: 47}]},
                            {c: [{v: '170.315 (a)(12)'},{v: 40}]},
                            {c: [{v: '170.315 (a)(13)'},{v: 34}]},
                            {c: [{v: '170.315 (a)(14)'},{v: 35}]},
                            {c: [{v: '170.315 (a)(15)'},{v: 6}]},
                            {c: [{v: '170.315 (b)(1)'},{v: 28}]},
                            {c: [{v: '170.315 (b)(2)'},{v: 26}]},
                            {c: [{v: '170.315 (b)(3)'},{v: 31}]},
                            {c: [{v: '170.315 (b)(4)'},{v: 10}]},
                            {c: [{v: '170.315 (b)(5)'},{v: 8}]},
                            {c: [{v: '170.315 (b)(6)'},{v: 28}]},
                            {c: [{v: '170.315 (b)(7)'},{v: 4}]},
                            {c: [{v: '170.315 (b)(8)'},{v: 4}]},
                            {c: [{v: '170.315 (b)(9)'},{v: 2}]},
                            {c: [{v: '170.315 (c)(1)'},{v: 32}]},
                            {c: [{v: '170.315 (c)(2)'},{v: 39}]},
                            {c: [{v: '170.315 (c)(3)'},{v: 39}]},
                            {c: [{v: '170.315 (c)(4)'},{v: 11}]},
                            {c: [{v: '170.315 (d)(1)'},{v: 121}]},
                            {c: [{v: '170.315 (d)(2)'},{v: 113}]},
                            {c: [{v: '170.315 (d)(3)'},{v: 115}]},
                            {c: [{v: '170.315 (d)(4)'},{v: 58}]},
                            {c: [{v: '170.315 (d)(5)'},{v: 105}]},
                            {c: [{v: '170.315 (d)(6)'},{v: 65}]},
                            {c: [{v: '170.315 (d)(7)'},{v: 91}]},
                            {c: [{v: '170.315 (d)(8)'},{v: 51}]},
                            {c: [{v: '170.315 (d)(9)'},{v: 62}]},
                            {c: [{v: '170.315 (d)(10)'},{v: 4}]},
                            {c: [{v: '170.315 (d)(11)'},{v: 13}]},
                            {c: [{v: '170.315 (e)(1)'},{v: 37}]},
                            {c: [{v: '170.315 (e)(2)'},{v: 40}]},
                            {c: [{v: '170.315 (e)(3)'},{v: 35}]},
                            {c: [{v: '170.315 (f)(1)'},{v: 32}]},
                            {c: [{v: '170.315 (f)(2)'},{v: 27}]},
                            {c: [{v: '170.315 (f)(3)'},{v: 23}]},
                            {c: [{v: '170.315 (f)(4)'},{v: 8}]},
                            {c: [{v: '170.315 (f)(6)'},{v: 7}]},
                            {c: [{v: '170.315 (f)(7)'},{v: 9}]},
                            {c: [{v: '170.315 (g)(1)'},{v: 3}]},
                            {c: [{v: '170.315 (g)(2)'},{v: 21}]},
                            {c: [{v: '170.315 (g)(3)'},{v: 45}]},
                            {c: [{v: '170.315 (g)(4)'},{v: 131}]},
                            {c: [{v: '170.315 (g)(5)'},{v: 131}]},
                            {c: [{v: '170.315 (g)(6)'},{v: 49}]},
                            {c: [{v: '170.315 (g)(7)'},{v: 31}]},
                            {c: [{v: '170.315 (g)(8)'},{v: 30}]},
                            {c: [{v: '170.315 (g)(9)'},{v: 30}]},
                            {c: [{v: '170.315 (h)(1)'},{v: 18}]},
                            {c: [{v: '170.315 (h)(2)'},{v: 7}]},
                        ],
                    },
                    options: {
                        title: 'Count of 2015 Products attesting to Criteria',
                    },
                },
                qmsStandards: {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'QMS Standard', type: 'string'},
                            { label: 'Number of Products', type: 'number'},
                        ],
                        rows: [
                            {c: [{v: '(Deming) PDCA Cycle'},{v: 1}]},
                            {c: [{v: '21 CFR 820'},{v: 3}]},
                            {c: [{v: '21 CFR Part 820 Quality System Regulations; ISO 13485:2003; EN ISO 13485:2012 Medical Devices - Quality Management Systems; ISO 9001:2008 Quality Management Systems'},{v: 1}]},
                            {c: [{v: '21 CFR Part 820 Quality System Regulations; ISO 13485:2003; ISO 9001:2008'},{v: 1}]},
                            {c: [{v: '21 CFR Part 820'},{v: 18}]},
                            {c: [{v: '21 CFR Part 820; ISO 13485:2003; ISO 9001:2008'},{v: 1}]},
                            {c: [{v: 'FDA 21 Code of Federal Regulation (CFR) Part 820'},{v: 1}]},
                            {c: [{v: 'FDA Quality System Regulation - 21 CFR Part 820'},{v: 2}]},
                            {c: [{v: 'Food and Drug Administration�s Code of Federal Regulations Title 21 Part 820 Quality System Regulation'},{v: 29}]},
                            {c: [{v: 'Home Grown'},{v: 139}]},
                            {c: [{v: 'Home-Grown'},{v: 3}]},
                            {c: [{v: 'Home-grown Agile methodology mapped to ISO:9001'},{v: 2}]},
                            {c: [{v: 'Homegrown mapped to ISO 9001'},{v: 1}]},
                            {c: [{v: 'Homegrown or Modified Standard'},{v: 2}]},
                            {c: [{v: 'Homegrown'},{v: 7}]},
                            {c: [{v: 'IEC 62304'},{v: 1}]},
                            {c: [{v: 'ISO 13458'},{v: 21}]},
                            {c: [{v: 'ISO 13485 Medical Devices � Quality Management Systems'},{v: 1}]},
                            {c: [{v: 'ISO 13485'},{v: 5}]},
                            {c: [{v: 'ISO 13485, 9001, 13485'},{v: 3}]},
                            {c: [{v: 'ISO 13485:2003 and EN ISO 13485:2012 Medical Devices - Quality management systems - Requirements for regulatory purposes and ISO 9001:2008 Quality management systems - Requirements'},{v: 4}]},
                            {c: [{v: 'ISO 13485:2003 and ISO 9001:2008 Quality management systems'},{v: 1}]},
                            {c: [{v: 'ISO 9001'},{v: 194}]},
                            {c: [{v: 'ISO 9001: 2008'},{v: 1}]},
                            {c: [{v: 'ISO 9001:2008'},{v: 2}]},
                            {c: [{v: 'ISO 9001:2015'},{v: 2}]},
                            {c: [{v: 'ISO 9001; FDA Quality Systems Requirements'},{v: 2}]},
                            {c: [{v: 'ISO 9001; ISMS/ISO/IEC 27001'},{v: 1}]},
                            {c: [{v: 'ISO 9001; ISO 13485'},{v: 4}]},
                            {c: [{v: 'ISO PDCA, ISO 9001:2015'},{v: 1}]},
                            {c: [{v: 'ISO-9001'},{v: 3}]},
                            {c: [{v: 'ISO-9001:2008, Quality Management Systems Requirements, ISO 13485:2003 Medical Devices Quality Management System - Requirements for Regulatory Purposes'},{v: 2}]},
                            {c: [{v: 'ISO9001:2015'},{v: 1}]},
                            {c: [{v: 'Microsoft Solution Framework; Microsoft Operations Framework'},{v: 1}]},
                            {c: [{v: 'Modified ISO-9001-2015'},{v: 1}]},
                            {c: [{v: 'Modified QMS/Mapped'},{v: 112}]},
                            {c: [{v: 'Modified'},{v: 1}]},
                            {c: [{v: 'N/A'},{v: 1}]},
                            {c: [{v: 'None'},{v: 25}]},
                            {c: [{v: 'Scrum mapped to ISO 9001'},{v: 2}]},
                            {c: [{v: 'Scrum'},{v: 1}]},
                            {c: [{v: 'Self-Develop'},{v: 4}]},
                            {c: [{v: 'Self-developed'},{v: 2}]},
                        ],
                    },
                    options: {
                        title: 'Number of Products using a given QMS Standard',
                        vAxis: {
                            logScale: true,
                        },
                    },
                },
                accessibilityStandards: {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'Accessibility Standard', type: 'string'},
                            { label: 'Number of Products', type: 'number'},
                        ],
                        rows: [
                            {c: [{v: '0'},{v: 1}]},
                            {c: [{v: '170.204(a)(1)'},{v: 1}]},
                            {c: [{v: 'ETSI ES 202 076 -'},{v: 2}]},
                            {c: [{v: 'ISO/IEC 40500:2012'},{v: 1}]},
                            {c: [{v: 'none'},{v: 1}]},
                            {c: [{v: 'None'},{v: 22}]},
                            {c: [{v: 'None -'},{v: 39}]},
                            {c: [{v: 'Other - ISO/IEC 4050'},{v: 1}]},
                            {c: [{v: 'Other - ISO/IEC 40500:2012'},{v: 8}]},
                            {c: [{v: 'Other - Mapped to ISO 9001'},{v: 1}]},
                            {c: [{v: 'Other - NIST 7741'},{v: 1}]},
                            {c: [{v: 'Other - WCAG'},{v: 1}]},
                            {c: [{v: 'Other - WCAG 2.0'},{v: 10}]},
                            {c: [{v: 'Other - WCAG 2.0 Level A'},{v: 6}]},
                            {c: [{v: 'Other - WCAG Level'},{v: 1}]},
                            {c: [{v: 'Section 508'},{v: 3}]},
                            {c: [{v: 'Section 508 and WCAG 2.0 AA'},{v: 9}]},
                            {c: [{v: 'Section 508 of the Rehabilitation Act'},{v: 2}]},
                            {c: [{v: 'Section 508 of the Rehabilitation Act -'},{v: 3}]},
                            {c: [{v: 'W3C Web Design and Applications'},{v: 1}]},
                            {c: [{v: 'W3C Web of Devices'},{v: 1}]},
                            {c: [{v: 'WCAG 2.0 AA'},{v: 1}]},
                            {c: [{v: 'WCAG 2.0 Level AA'},{v: 18}]},
                        ],
                    },
                    options: {
                        title: 'Number of Products using a given Accessibility Standard',
                        vAxis: {
                            logScale: true,
                        },
                    },
                },
                cqms: {
                    type: 'ColumnChart',
                    data: {
                        cols: [
                            { label: 'CQM', type: 'string'},
                            { label: 'Number of Products', type: 'number'},
                        ],
                        rows: [
                            {c: [{v: 'CMS2'},{v: 770}]},
                            {c: [{v: 'CMS22'},{v: 617}]},
                            {c: [{v: 'CMS26'},{v: 349}]},
                            {c: [{v: 'CMS30'},{v: 403}]},
                            {c: [{v: 'CMS31'},{v: 324}]},
                            {c: [{v: 'CMS32'},{v: 415}]},
                            {c: [{v: 'CMS50'},{v: 989}]},
                            {c: [{v: 'CMS52'},{v: 352}]},
                            {c: [{v: 'CMS53'},{v: 329}]},
                            {c: [{v: 'CMS55'},{v: 445}]},
                            {c: [{v: 'CMS56'},{v: 443}]},
                            {c: [{v: 'CMS60'},{v: 330}]},
                            {c: [{v: 'CMS61'},{v: 363}]},
                            {c: [{v: 'CMS62'},{v: 537}]},
                            {c: [{v: 'CMS64'},{v: 295}]},
                            {c: [{v: 'CMS65'},{v: 586}]},
                            {c: [{v: 'CMS66'},{v: 442}]},
                            {c: [{v: 'CMS68'},{v: 1372}]},
                            {c: [{v: 'CMS69'},{v: 1362}]},
                            {c: [{v: 'CMS71'},{v: 473}]},
                            {c: [{v: 'CMS72'},{v: 449}]},
                            {c: [{v: 'CMS73'},{v: 427}]},
                            {c: [{v: 'CMS74'},{v: 449}]},
                            {c: [{v: 'CMS75'},{v: 742}]},
                            {c: [{v: 'CMS77'},{v: 392}]},
                            {c: [{v: 'CMS82'},{v: 415}]},
                            {c: [{v: 'CMS9'},{v: 310}]},
                            {c: [{v: 'CMS90'},{v: 585}]},
                            {c: [{v: 'CMS91'},{v: 437}]},
                            {c: [{v: 'CMS100'},{v: 394}]},
                            {c: [{v: 'CMS102'},{v: 433}]},
                            {c: [{v: 'CMS104'},{v: 473}]},
                            {c: [{v: 'CMS105'},{v: 464}]},
                            {c: [{v: 'CMS107'},{v: 469}]},
                            {c: [{v: 'CMS108'},{v: 454}]},
                            {c: [{v: 'CMS109'},{v: 406}]},
                            {c: [{v: 'CMS110'},{v: 465}]},
                            {c: [{v: 'CMS111'},{v: 442}]},
                            {c: [{v: 'CMS113'},{v: 345}]},
                            {c: [{v: 'CMS114'},{v: 400}]},
                            {c: [{v: 'CMS117'},{v: 866}]},
                            {c: [{v: 'CMS122'},{v: 884}]},
                            {c: [{v: 'CMS123'},{v: 680}]},
                            {c: [{v: 'CMS124'},{v: 732}]},
                            {c: [{v: 'CMS125'},{v: 789}]},
                            {c: [{v: 'CMS126'},{v: 924}]},
                            {c: [{v: 'CMS127'},{v: 979}]},
                            {c: [{v: 'CMS128'},{v: 393}]},
                            {c: [{v: 'CMS129'},{v: 366}]},
                            {c: [{v: 'CMS130'},{v: 812}]},
                            {c: [{v: 'CMS131'},{v: 707}]},
                            {c: [{v: 'CMS132'},{v: 460}]},
                            {c: [{v: 'CMS133'},{v: 416}]},
                            {c: [{v: 'CMS134'},{v: 591}]},
                            {c: [{v: 'CMS135'},{v: 420}]},
                            {c: [{v: 'CMS136'},{v: 503}]},
                            {c: [{v: 'CMS137'},{v: 417}]},
                            {c: [{v: 'CMS138'},{v: 1533}]},
                            {c: [{v: 'CMS139'},{v: 743}]},
                            {c: [{v: 'CMS140'},{v: 342}]},
                            {c: [{v: 'CMS141'},{v: 329}]},
                            {c: [{v: 'CMS142'},{v: 508}]},
                            {c: [{v: 'CMS143'},{v: 521}]},
                            {c: [{v: 'CMS144'},{v: 437}]},
                            {c: [{v: 'CMS145'},{v: 405}]},
                            {c: [{v: 'CMS146'},{v: 896}]},
                            {c: [{v: 'CMS147'},{v: 1071}]},
                            {c: [{v: 'CMS148'},{v: 588}]},
                            {c: [{v: 'CMS149'},{v: 384}]},
                            {c: [{v: 'CMS153'},{v: 707}]},
                            {c: [{v: 'CMS154'},{v: 811}]},
                            {c: [{v: 'CMS155'},{v: 1069}]},
                            {c: [{v: 'CMS156'},{v: 1248}]},
                            {c: [{v: 'CMS157'},{v: 373}]},
                            {c: [{v: 'CMS158'},{v: 418}]},
                            {c: [{v: 'CMS159'},{v: 341}]},
                            {c: [{v: 'CMS160'},{v: 363}]},
                            {c: [{v: 'CMS161'},{v: 430}]},
                            {c: [{v: 'CMS163'},{v: 756}]},
                            {c: [{v: 'CMS164'},{v: 655}]},
                            {c: [{v: 'CMS165'},{v: 1471}]},
                            {c: [{v: 'CMS166'},{v: 1033}]},
                            {c: [{v: 'CMS167'},{v: 521}]},
                            {c: [{v: 'CMS169'},{v: 361}]},
                            {c: [{v: 'CMS171'},{v: 282}]},
                            {c: [{v: 'CMS172'},{v: 274}]},
                            {c: [{v: 'CMS177'},{v: 401}]},
                            {c: [{v: 'CMS178'},{v: 308}]},
                            {c: [{v: 'CMS179'},{v: 234}]},
                            {c: [{v: 'CMS182'},{v: 508}]},
                            {c: [{v: 'CMS185'},{v: 328}]},
                            {c: [{v: 'CMS188'},{v: 277}]},
                            {c: [{v: 'CMS190'},{v: 451}]},
                        ],
                    },
                    options: {
                        title: 'Number of Products with a given CQM',
                    },
                },
            };
        }

        function applyFilter () {
            vm.charts.uniqueProducts.data.rows = vm.safeRows.filter(function (row) {
                return (!vm.startDate || vm.startDate <= row.c[0].v) &&
                    (!vm.endDate || vm.endDate >= row.c[0].v);
            });
        }

        function toggleSeries (selectedItem) {
            var col = selectedItem.column;
            if (selectedItem.row === null) {
                if (vm.charts.uniqueProducts.view.columns[col] === col) {
                    vm.charts.uniqueProducts.view.columns[col] = {
                        label: vm.charts.uniqueProducts.data.cols[col].label,
                        type: vm.charts.uniqueProducts.data.cols[col].type,
                        calc: function () {
                            return null;
                        },
                    };
                    vm.charts.uniqueProducts.options.colors[col - 1] = '#ccc';
                }
                else {
                    vm.charts.uniqueProducts.view.columns[col] = col;
                    vm.charts.uniqueProducts.options.colors[col - 1] = vm.charts.uniqueProducts.options.defaultColors[col - 1];
                }
            }
        }

        function loadFakeData () {
            vm.startDate = new Date('Fri Apr 08 2016');
            vm.endDate = new Date('Fri Aug 11 2017');
            vm.charts.uniqueProducts.data = {
                cols: [
                    { label: 'Date', type: 'date' },
                    {label: 'Total Number of Unique Products over time', type: 'number' },
                    {label: 'Total Number of Unique Products w/ Active Listings Over Time', type: 'number' },
                    {label: 'Total Number of Unique Products w/ Active 2014 Listings', type: 'number' },
                    {label: 'Total Number of Unique Products w/ Active 2015 Listings', type: 'number' },
                ],
            };
            vm.safeRows = [
                {c: [{v: new Date('Fri Apr 08 2016')},{v: 2302},{v: 1070 + 1},{v: 1070},{v: 1}]},
                {c: [{v: new Date('Fri Apr 08 2016')},{v: 2302},{v: 1070 + 1},{v: 1070},{v: 1}]},
                {c: [{v: new Date('Fri Apr 15 2016')},{v: 2303},{v: 1072 + 2},{v: 1072},{v: 2}]},
                {c: [{v: new Date('Fri Apr 22 2016')},{v: 2303},{v: 1072 + 2},{v: 1072},{v: 2}]},
                {c: [{v: new Date('Fri Apr 29 2016')},{v: 2307},{v: 1076 + 2},{v: 1076},{v: 2}]},
                {c: [{v: new Date('Fri May 06 2016')},{v: 2312},{v: 1083 + 2},{v: 1083},{v: 2}]},
                {c: [{v: new Date('Fri May 13 2016')},{v: 2312},{v: 1083 + 3},{v: 1083},{v: 3}]},
                {c: [{v: new Date('Fri May 20 2016')},{v: 2313},{v: 1084 + 3},{v: 1084},{v: 3}]},
                {c: [{v: new Date('Fri May 27 2016')},{v: 2315},{v: 1086 + 3},{v: 1086},{v: 3}]},
                {c: [{v: new Date('Fri Jun 03 2016')},{v: 2315},{v: 1088 + 3},{v: 1088},{v: 3}]},
                {c: [{v: new Date('Fri Jun 10 2016')},{v: 2315},{v: 1089 + 3},{v: 1089},{v: 3}]},
                {c: [{v: new Date('Fri Jun 17 2016')},{v: 2317},{v: 1092 + 3},{v: 1092},{v: 3}]},
                {c: [{v: new Date('Fri Jun 24 2016')},{v: 2321},{v: 1094 + 6},{v: 1094},{v: 6}]},
                {c: [{v: new Date('Fri Jul 01 2016')},{v: 2322},{v: 1097 + 6},{v: 1097},{v: 6}]},
                {c: [{v: new Date('Fri Jul 08 2016')},{v: 2325},{v: 1100 + 7},{v: 1100},{v: 7}]},
                {c: [{v: new Date('Fri Jul 15 2016')},{v: 2325},{v: 1100 + 7},{v: 1100},{v: 7}]},
                {c: [{v: new Date('Fri Jul 22 2016')},{v: 2326},{v: 1101 + 7},{v: 1101},{v: 7}]},
                {c: [{v: new Date('Fri Jul 29 2016')},{v: 2329},{v: 1104 + 7},{v: 1104},{v: 7}]},
                {c: [{v: new Date('Fri Aug 05 2016')},{v: 2332},{v: 1106 + 8},{v: 1106},{v: 8}]},
                {c: [{v: new Date('Fri Aug 12 2016')},{v: 2334},{v: 1106 + 8},{v: 1106},{v: 8}]},
                {c: [{v: new Date('Fri Aug 19 2016')},{v: 2337},{v: 1109 + 8},{v: 1109},{v: 8}]},
                {c: [{v: new Date('Fri Aug 26 2016')},{v: 2338},{v: 1109 + 9},{v: 1109},{v: 9}]},
                {c: [{v: new Date('Fri Sep 02 2016')},{v: 2339},{v: 1110 + 9},{v: 1110},{v: 9}]},
                {c: [{v: new Date('Fri Sep 09 2016')},{v: 2339},{v: 1110 + 10},{v: 1110},{v: 10}]},
                {c: [{v: new Date('Fri Sep 16 2016')},{v: 2340},{v: 1112 + 10},{v: 1112},{v: 10}]},
                {c: [{v: new Date('Fri Sep 23 2016')},{v: 2343},{v: 1115 + 10},{v: 1115},{v: 10}]},
                {c: [{v: new Date('Fri Sep 30 2016')},{v: 2343},{v: 1115 + 10},{v: 1115},{v: 10}]},
                {c: [{v: new Date('Fri Oct 07 2016')},{v: 2359},{v: 1131 + 11},{v: 1131},{v: 11}]},
                {c: [{v: new Date('Fri Oct 14 2016')},{v: 2360},{v: 1133 + 11},{v: 1133},{v: 11}]},
                {c: [{v: new Date('Fri Oct 21 2016')},{v: 2360},{v: 1138 + 11},{v: 1138},{v: 11}]},
                {c: [{v: new Date('Fri Oct 28 2016')},{v: 2362},{v: 1141 + 11},{v: 1141},{v: 11}]},
                {c: [{v: new Date('Fri Nov 04 2016')},{v: 2362},{v: 1143 + 12},{v: 1143},{v: 12}]},
                {c: [{v: new Date('Fri Nov 11 2016')},{v: 2365},{v: 1145 + 14},{v: 1145},{v: 14}]},
                {c: [{v: new Date('Fri Nov 18 2016')},{v: 2367},{v: 1146 + 13},{v: 1146},{v: 13}]},
                {c: [{v: new Date('Fri Nov 25 2016')},{v: 2373},{v: 1152 + 15},{v: 1152},{v: 15}]},
                {c: [{v: new Date('Fri Dec 02 2016')},{v: 2374},{v: 1153 + 15},{v: 1153},{v: 15}]},
                {c: [{v: new Date('Fri Dec 09 2016')},{v: 2376},{v: 1155 + 18},{v: 1155},{v: 18}]},
                {c: [{v: new Date('Fri Dec 16 2016')},{v: 2378},{v: 1156 + 22},{v: 1156},{v: 22}]},
                {c: [{v: new Date('Fri Dec 23 2016')},{v: 2384},{v: 1160 + 26},{v: 1160},{v: 26}]},
                {c: [{v: new Date('Fri Dec 30 2016')},{v: 2391},{v: 1166 + 29},{v: 1166},{v: 29}]},
                {c: [{v: new Date('Fri Jan 06 2017')},{v: 2393},{v: 1167 + 31},{v: 1167},{v: 31}]},
                {c: [{v: new Date('Fri Jan 13 2017')},{v: 2397},{v: 1169 + 31},{v: 1169},{v: 31}]},
                {c: [{v: new Date('Fri Jan 20 2017')},{v: 2398},{v: 1170 + 31},{v: 1170},{v: 31}]},
                {c: [{v: new Date('Fri Jan 27 2017')},{v: 2400},{v: 1173 + 32},{v: 1173},{v: 32}]},
                {c: [{v: new Date('Fri Feb 03 2017')},{v: 2404},{v: 1176 + 35},{v: 1176},{v: 35}]},
                {c: [{v: new Date('Fri Feb 10 2017')},{v: 2406},{v: 1176 + 39},{v: 1176},{v: 39}]},
                {c: [{v: new Date('Fri Feb 17 2017')},{v: 2408},{v: 1180 + 41},{v: 1180},{v: 41}]},
                {c: [{v: new Date('Fri Feb 24 2017')},{v: 2409},{v: 1182 + 43},{v: 1182},{v: 43}]},
                {c: [{v: new Date('Fri Mar 03 2017')},{v: 2410},{v: 1182 + 44},{v: 1182},{v: 44}]},
                {c: [{v: new Date('Fri Mar 10 2017')},{v: 2412},{v: 1185 + 44},{v: 1185},{v: 44}]},
                {c: [{v: new Date('Fri Mar 17 2017')},{v: 2415},{v: 1186 + 47},{v: 1186},{v: 47}]},
                {c: [{v: new Date('Fri Mar 24 2017')},{v: 2415},{v: 1186 + 47},{v: 1186},{v: 47}]},
                {c: [{v: new Date('Fri Mar 31 2017')},{v: 2415},{v: 1188 + 48},{v: 1188},{v: 48}]},
                {c: [{v: new Date('Fri Apr 07 2017')},{v: 2416},{v: 1188 + 49},{v: 1188},{v: 49}]},
                {c: [{v: new Date('Fri Apr 14 2017')},{v: 2417},{v: 1192 + 51},{v: 1192},{v: 51}]},
                {c: [{v: new Date('Fri Apr 21 2017')},{v: 2420},{v: 1194 + 53},{v: 1194},{v: 53}]},
                {c: [{v: new Date('Fri Apr 28 2017')},{v: 2420},{v: 1194 + 53},{v: 1194},{v: 53}]},
                {c: [{v: new Date('Fri May 05 2017')},{v: 2420},{v: 1195 + 56},{v: 1195},{v: 56}]},
                {c: [{v: new Date('Fri May 12 2017')},{v: 2420},{v: 1195 + 56},{v: 1195},{v: 56}]},
                {c: [{v: new Date('Fri May 19 2017')},{v: 2422},{v: 1196 + 59},{v: 1196},{v: 59}]},
                {c: [{v: new Date('Fri May 26 2017')},{v: 2423},{v: 1198 + 61},{v: 1198},{v: 61}]},
                {c: [{v: new Date('Fri Jun 02 2017')},{v: 2426},{v: 1203 + 61},{v: 1203},{v: 61}]},
                {c: [{v: new Date('Fri Jun 09 2017')},{v: 2428},{v: 1205 + 64},{v: 1205},{v: 64}]},
                {c: [{v: new Date('Fri Jun 16 2017')},{v: 2429},{v: 1206 + 66},{v: 1206},{v: 66}]},
                {c: [{v: new Date('Fri Jun 23 2017')},{v: 2431},{v: 1206 + 70},{v: 1206},{v: 70}]},
                {c: [{v: new Date('Fri Jun 30 2017')},{v: 2433},{v: 1208 + 70},{v: 1208},{v: 70}]},
                {c: [{v: new Date('Fri Jul 07 2017')},{v: 2434},{v: 1209 + 70},{v: 1209},{v: 70}]},
                {c: [{v: new Date('Fri Jul 14 2017')},{v: 2439},{v: 1210 + 76},{v: 1210},{v: 76}]},
                {c: [{v: new Date('Fri Jul 21 2017')},{v: 2439},{v: 1210 + 76},{v: 1210},{v: 76}]},
                {c: [{v: new Date('Fri Jul 28 2017')},{v: 2443},{v: 1210 + 80},{v: 1210},{v: 80}]},
                {c: [{v: new Date('Fri Aug 04 2017')},{v: 2443},{v: 1210 + 82},{v: 1210},{v: 82}]},
                {c: [{v: new Date('Fri Aug 11 2017')},{v: 2443},{v: 1210 + 82},{v: 1210},{v: 82}]},
            ];
        }

        ////////////////////////////////////////////////////////////////////

        function _parseData () {
            var c, testDate;
            var mapObj = {};
            vm.minDate = new Date();
            vm.maxDate = new Date('Jan 1 2016');
            angular.forEach(vm.statistics, function (item) {
                vm.charts.uniqueProducts.data.cols.push({ label: angular.copy(item.type.dataType), type: 'number'});
                angular.forEach(item.statistics, function (data) {
                    if (!mapObj[data.date]) {
                        mapObj[data.date] = {date: data.date};
                        mapObj[data.date].values = [];
                        testDate = new Date(data.date);
                        if (testDate < vm.minDate) {
                            vm.minDate = testDate;
                        }
                        if (testDate > vm.maxDate) {
                            vm.maxDate = testDate;
                        }
                    }
                    mapObj[data.date].values.push(data.value);
                });
            });
            vm.safeRows = [];
            angular.forEach(mapObj, function (row) {
                c = [{v: new Date(row.date)}];
                c = c.concat(row.values.map(function (val) { return {v: val }; }))
                vm.safeRows.push({c: c});
            });
            vm.startDate = angular.copy(vm.minDate);
            vm.endDate = angular.copy(vm.maxDate);
        }
    }
})();
