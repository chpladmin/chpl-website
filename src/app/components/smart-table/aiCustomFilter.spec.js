(() => {
    'use strict';

    describe('the Custom Smart-Table Filter', () => {

        var $log, Mock, aiCustomFilter, mock;

        mock = {
            /* eslint-disable quotes, key-spacing */
            correctiveActionCollection: [{"id":3,"chplProductNumber":"CHP-029177","edition":"2014","acb":"UL LLC","developer":"Intuitive Medical Documents","product":"Intuitive Medical Document","version":"2.0","certificationStatus":"Active","surveillanceCount":2,"openNonconformityCount":1,"closedNonconformityCount":1,"mainSearch":"Intuitive Medical Documents|Intuitive Medical Document|2.0|CHP-029177","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":1}"},{"id":3,"chplProductNumber":"CHP-029177","edition":"2014","acb":"UL LLC","developer":"Intuitive Medical Documents","product":"Intuitive Medical Document","version":"2.0","certificationStatus":"Active","surveillanceCount":2,"openNonconformityCount":1,"closedNonconformityCount":1,"mainSearch":"Intuitive Medical Documents|Intuitive Medical Document|2.0|CHP-029177","nonconformities":null},{"id":7847,"chplProductNumber":"CHP-029176","edition":"2014","acb":"UL LLC","developer":"Intuitive Medical Documents","product":"Intuitive Medical Document","version":"2.0","certificationStatus":"Active","surveillanceCount":2,"openNonconformityCount":1,"closedNonconformityCount":1,"mainSearch":"Intuitive Medical Documents|Intuitive Medical Document|2.0|CHP-029176","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":1}"},{"id":4884,"chplProductNumber":"CHP-021264","edition":"2014","acb":"Drummond Group","developer":"LSS Data Systems","product":"Medical and Practice Management (MPM) 6.0 Continuity of Care (CCD) Interface Suite","version":"6.08","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"LSS Data Systems|Medical and Practice Management (MPM) 6.0 Continuity of Care (CCD) Interface Suite|6.08|CHP-021264","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4890,"chplProductNumber":"CHP-021271","edition":"2014","acb":"Drummond Group","developer":"LSS Data Systems","product":"Medical and Practice Management (MPM) Client/Server Continuity of Care (CCD) Interface Suite","version":"5.6.6","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"LSS Data Systems|Medical and Practice Management (MPM) Client/Server Continuity of Care (CCD) Interface Suite|5.6.6|CHP-021271","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4215,"chplProductNumber":"CHP-025135","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"MEDITECH MAGIC Continuity of Care Interface (CCD) Suite","version":"v5.67","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|MEDITECH MAGIC Continuity of Care Interface (CCD) Suite|v5.67|CHP-025135","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4976,"chplProductNumber":"CHP-023352","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"Medical and Practice Management (MPM)","version":"6.08","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|Medical and Practice Management (MPM)|6.08|CHP-023352","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":7717,"chplProductNumber":"14.04.04.2931.MEDI.08.1.1.160426","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"MEDITECH 6.0 Continuity of Care (CCD) Interface Suite","version":"v6.08","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|MEDITECH 6.0 Continuity of Care (CCD) Interface Suite|v6.08|14.04.04.2931.MEDI.08.1.1.160426","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":8052,"chplProductNumber":"14.04.04.2931.MEDI.CC.1.1.160929","edition":"2014","acb":"Drummond Group","developer":"Medical Information Technology, Inc. (MEDITECH)","product":"MEDITECH Medical and Practice Management (MPM) MAGIC Continuity of Care (CCD) Interface Suite","version":"v5.67","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":1,"closedNonconformityCount":0,"mainSearch":"Medical Information Technology, Inc. (MEDITECH)|MEDITECH Medical and Practice Management (MPM) MAGIC Continuity of Care (CCD) Interface Suite|v5.67|14.04.04.2931.MEDI.CC.1.1.160929","nonconformities":"{\"openNonconformityCount\":1,\"closedNonconformityCount\":0}"},{"id":4445,"chplProductNumber":"CHP-027145","edition":"2014","acb":"Drummond Group","developer":"Accumedic Computer Systems, Inc.","product":"AccuMed","version":"v 12.11","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Accumedic Computer Systems, Inc.|AccuMed|v 12.11|CHP-027145","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5835,"chplProductNumber":"CHP-022107","edition":"2014","acb":"ICSA Labs","developer":"I Physician Hub","product":"Electronic Medical Office","version":"2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"I Physician Hub|Electronic Medical Office|2.0|CHP-022107","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5690,"chplProductNumber":"CHP-024518","edition":"2014","acb":"ICSA Labs","developer":"iMedics Inc.","product":"AmicusMD","version":"1","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"iMedics Inc.|AmicusMD|1|CHP-024518","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":3564,"chplProductNumber":"CHP-024472","edition":"2014","acb":"Drummond Group","developer":"Innovative Medical Practice Solutions","product":"SolidPractice","version":"3.5.4","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Innovative Medical Practice Solutions|SolidPractice|3.5.4|CHP-024472","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5312,"chplProductNumber":"CHP-029019","edition":"2014","acb":"Drummond Group","developer":"Mountainside Software, Inc.","product":"Mountainside Electronic Medical Records","version":"Version 3.2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Mountainside Software, Inc.|Mountainside Electronic Medical Records|Version 3.2.0|CHP-029019","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":5661,"chplProductNumber":"CHP-024851","edition":"2014","acb":"ICSA Labs","developer":"Perk Medical Systems Inc.","product":"ezPractice","version":"14.1","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Perk Medical Systems Inc.|ezPractice|14.1|CHP-024851","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":3696,"chplProductNumber":"CHP-025320","edition":"2014","acb":"Drummond Group","developer":"Spectrum Medical, Inc.","product":"VIPER Clinical Information Solution","version":"3.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Spectrum Medical, Inc.|VIPER Clinical Information Solution|3.0|CHP-025320","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":4943,"chplProductNumber":"CHP-022484","edition":"2014","acb":"Drummond Group","developer":"Tech-Time, Inc.","product":"STAT! Enterprise Medical Management","version":"2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Tech-Time, Inc.|STAT! Enterprise Medical Management|2.0|CHP-022484","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"},{"id":4944,"chplProductNumber":"CHP-022485","edition":"2014","acb":"Drummond Group","developer":"Tech-Time, Inc.","product":"STAT! Enterprise Medical Management","version":"2.0","certificationStatus":"Active","surveillanceCount":1,"openNonconformityCount":0,"closedNonconformityCount":1,"mainSearch":"Tech-Time, Inc.|STAT! Enterprise Medical Management|2.0|CHP-022485","nonconformities":"{\"openNonconformityCount\":0,\"closedNonconformityCount\":1}"}],
            surveillanceManagementCollection: [
                {"surveillance":"{\"openSurveillanceCount\":0,\"closedSurveillanceCount\":0,\"openNonconformityCount\":0,\"closedNonconformityCount\":0}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":0,\"openNonconformityCount\":0,\"closedNonconformityCount\":0,\"surveillanceDates\":\"1508716800000&\"}"},
                {"surveillance":"{\"openSurveillanceCount\":0,\"closedSurveillanceCount\":1,\"openNonconformityCount\":0,\"closedNonconformityCount\":0,\"surveillanceDates\":\"1508716800000&1512518400000\"}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":1,\"openNonconformityCount\":0,\"closedNonconformityCount\":0,\"surveillanceDates\":\"1508716800000&1512518400000☺1612518400000&\"}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":0,\"openNonconformityCount\":1,\"closedNonconformityCount\":0,\"surveillanceDates\":\"1508716800000&\"}"},
                {"surveillance":"{\"openSurveillanceCount\":0,\"closedSurveillanceCount\":1,\"openNonconformityCount\":1,\"closedNonconformityCount\":0,\"surveillanceDates\":\"1508716800000&1512518400000\"}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":1,\"openNonconformityCount\":1,\"closedNonconformityCount\":0,\"surveillanceDates\":\"1508716800000&1512518400000☺1612518400000&\"}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":0,\"openNonconformityCount\":0,\"closedNonconformityCount\":1,\"surveillanceDates\":\"1508716800000&\"}"},
                {"surveillance":"{\"openSurveillanceCount\":0,\"closedSurveillanceCount\":1,\"openNonconformityCount\":0,\"closedNonconformityCount\":1,\"surveillanceDates\":\"1508716800000&1512518400000\"}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":1,\"openNonconformityCount\":0,\"closedNonconformityCount\":1,\"surveillanceDates\":\"1508716800000&1512518400000☺1612518400000&\"}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":0,\"openNonconformityCount\":1,\"closedNonconformityCount\":1,\"surveillanceDates\":\"1508716800000&\"}"},
                {"surveillance":"{\"openSurveillanceCount\":0,\"closedSurveillanceCount\":1,\"openNonconformityCount\":1,\"closedNonconformityCount\":1,\"surveillanceDates\":\"1508716800000&1512518400000\"}"},
                {"surveillance":"{\"openSurveillanceCount\":1,\"closedSurveillanceCount\":1,\"openNonconformityCount\":1,\"closedNonconformityCount\":1,\"surveillanceDates\":\"1508716800000&1512518400000☺1612518400000&\"}"},
            ],
            /* eslint-enable quotes, key-spacing */
            editionItems: [{edition: '2011'}, {edition: '2014'}, {edition: '2015'}, {edition: '2015 Cures Update'}],
        };
        beforeEach(() => {
            angular.mock.module('chpl.services', 'chpl.components', 'chpl.mock');

            inject((_$log_, _Mock_, _customFilterFilter_) => {
                aiCustomFilter = _customFilterFilter_;
                $log = _$log_;
                Mock = _Mock_;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should filter on text', () => {
            expect(aiCustomFilter(Mock.allCps, {chplProductNumber: 'CHP-'}).length).toBe(5);
        });

        it('should return exact match searches values', () => {
            expect(aiCustomFilter(Mock.allCps, {practiceType: {distinct: 'Ambulatory'}}).length).toBe(5);
        });

        xit('should allow matching any', () => { //ignoring because mock data doesn't support these tests, until mock data can be updated
            expect(aiCustomFilter(Mock.allCps, {criteriaMet: {matchAny: {items: ['170.315 (d)(1)','170.315 (d)(10)']}}}).length).toBe(3);
        });

        xdescribe('surveillance section', () => { //ignoring because mock data doesn't support these tests, until mock data can be updated
            it('should filter on "never"', () => {
                var survFilter = {surveillance: 'never'};
                expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(3);
            });

            it('should filter on "has-had"', () => {
                var survFilter = {surveillance: 'has-had'};
                expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(4);
            });

            describe('when "has-had" the nonconformity subsection', () => {
                it('should filter on "no NCs"', () => {
                    var survFilter = {surveillance: 'has-had', NC: {never: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                it('should filter on "closed NCs"', () => {
                    var survFilter = {surveillance: 'has-had', NC: {closed: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(2);
                });

                it('should filter on "open NCs"', () => {
                    var survFilter = {surveillance: 'has-had', NC: {open: true}};
                    expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                });

                describe('when matching all', () => {
                    it('should filter on "no NCs & open"', () => {
                        var survFilter = {surveillance: 'has-had', matchAll: true, NC: {never: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(0);
                    });

                    it('should filter on "closed & open"', () => {
                        var survFilter = {surveillance: 'has-had', matchAll: true, NC: {closed: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(0);
                    });
                });

                describe('when matching any with multiples', () => {
                    it('should filter on "open & closed NCs"', () => {
                        var survFilter = {surveillance: 'has-had', NC: {open: true, closed: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(3);
                    });

                    it('should filter on "never & closed NCs"', () => {
                        var survFilter = {surveillance: 'has-had', NC: {never: true, closed: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(2);
                    });

                    it('should filter on "never & open NCs"', () => {
                        var survFilter = {surveillance: 'has-had', NC: {never: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(1);
                    });

                    it('should filter on "never, closed & open NCs"', () => {
                        var survFilter = {surveillance: 'has-had', NC: {never: true, closed: true, open: true}};
                        expect(aiCustomFilter(Mock.allCps, {surveillance: survFilter}).length).toBe(4);
                    });
                });
            });
        });

        describe('full surveillance section', () => {
            it('should filter on "never"', () => {
                var survFilter = {surveillance: {status: 'never'}};
                expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(1);
            });

            it('should filter on "has-had"', () => {
                var survFilter = {surveillance: {status: 'has-had'}};
                expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(12);
            });

            describe('when "has-had" the nonconformity subsection', () => {
                it('should filter on "no NCs"', () => {
                    var survFilter = {surveillance: {status: 'has-had'}, NC: {never: true}};
                    expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(3);
                });

                it('should filter on "closed NCs"', () => {
                    var survFilter = {surveillance: {status: 'has-had'}, NC: {closed: true}};
                    expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(6);
                });

                it('should filter on "open NCs"', () => {
                    var survFilter = {surveillance: {status: 'has-had'}, NC: {open: true}};
                    expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(6);
                });

                describe('when matching all', () => {
                    it('should filter on "no NCs & open"', () => {
                        var survFilter = {surveillance: {status: 'has-had'}, matchAll: true, NC: {never: true, open: true}};
                        expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(0);
                    });

                    it('should filter on "closed & open"', () => {
                        var survFilter = {surveillance: {status: 'has-had'}, matchAll: true, NC: {closed: true, open: true}};
                        expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(3);
                    });
                });

                describe('when matching any with multiples', () => {
                    it('should filter on "open & closed NCs"', () => {
                        var survFilter = {surveillance: {status: 'has-had'}, NC: {open: true, closed: true}};
                        expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(9);
                    });

                    it('should filter on "never & closed NCs"', () => {
                        var survFilter = {surveillance: {status: 'has-had'}, NC: {never: true, closed: true}};
                        expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(3);
                    });

                    it('should filter on "never & open NCs"', () => {
                        var survFilter = {surveillance: {status: 'has-had'}, NC: {never: true, open: true}};
                        expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(3);
                    });

                    it('should filter on "never, closed & open NCs"', () => {
                        var survFilter = {surveillance: {status: 'has-had'}, NC: {never: true, closed: true, open: true}};
                        expect(aiCustomFilter(mock.surveillanceManagementCollection, {surveillance: survFilter}).length).toBe(12);
                    });
                });
            });
        });

        describe('nonconformity section', () => {
            it('should allow all when no filter', () => {
                var ncFilter = {nonconformities: {}};
                expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(17);
            });

            describe('when matching any', () => {
                it('should filter on "has open NCs"', () => {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(8);
                });

                it('should filter on "has closed NCs"', () => {
                    var ncFilter = {
                        nonconformities: {
                            closed: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(11);
                });

                it('should filter on "has open || closed NCs"', () => {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                            closed: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(17);
                });
            });

            describe('when matching all', () => {
                it('should filter on "has open && closed NCs"', () => {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                            closed: true,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(2);
                });

                it('should filter on "has open && no closed NCs"', () => {
                    var ncFilter = {
                        nonconformities: {
                            open: true,
                            closed: false,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(6);
                });

                it('should filter on "has no open && closed NCs"', () => {
                    var ncFilter = {
                        nonconformities: {
                            open: false,
                            closed: true,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(9);
                });

                it('should filter on "has no open && no closed NCs"', () => {
                    var ncFilter = {
                        nonconformities: {
                            open: false,
                            closed: false,
                            matchAll: true,
                        },
                    };
                    expect(aiCustomFilter(mock.correctiveActionCollection, {nonconformities: ncFilter}).length).toBe(0);
                });
            });
        });

        describe('when filtering on certification edition', () => {
            let query;
            beforeEach(() => {
                query = {
                    certificationEdition: {
                        items: [
                            { value: '2011', selected: false },
                            { value: '2014', selected: false },
                            { value: '2015', selected: false },
                            { value: '2015 Cures Edition', selected: false },
                        ],
                    },
                };
            });

            it('should find 2011 edition', () => {
                query.certificationEdition.items
                    .filter(edition => edition.value === '2011')
                    .forEach(edition => edition.selected = true);
                expect(aiCustomFilter(mock.editionItems, query).length).toBe(1);
            });

            it('should find 2014 edition', () => {
                query.certificationEdition.items
                    .filter(edition => edition.value === '2014')
                    .forEach(edition => edition.selected = true);
                expect(aiCustomFilter(mock.editionItems, query).length).toBe(1);
            });

            it('should find 2015 edition', () => {
                query.certificationEdition.items
                    .filter(edition => edition.value === '2015')
                    .forEach(edition => edition.selected = true);
                expect(aiCustomFilter(mock.editionItems, query).length).toBe(1);
            });

            it('should find 2015 Cures Update edition', () => {
                query.certificationEdition.items
                    .filter(edition => edition.value === '2015 Cures Update')
                    .forEach(edition => edition.selected = true);
                expect(aiCustomFilter(mock.editionItems, query).length).toBe(1);
            });

            it('should find both 2015 editions', () => {
                query.certificationEdition.items
                    .filter(edition => edition.value === '2015' || edition.value === '2015 Cures Update')
                    .forEach(edition => edition.selected = true);
                expect(aiCustomFilter(mock.editionItems, query).length).toBe(1);
            });
        });
    });
})();
