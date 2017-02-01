/* eslint-disable */
(function () {
    'use strict';

    angular.module('chpl.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController ($scope, $log, $location, $localStorage, $filter, commonService, utilService, CACHE_TIMEOUT) {
        var vm = this;

        vm.clear = clear;
        vm.clearFilters = clearFilters;
        vm.clearPreviouslyCompared = clearPreviouslyCompared;
        vm.clearPreviouslyViewed = clearPreviouslyViewed;
        vm.clearSurveillanceActivityFilter = clearSurveillanceActivityFilter;
        vm.certificationStatusFilter = certificationStatusFilter;
        vm.compare = compare;
        vm.isCategoryChanged = isCategoryChanged;
        vm.isChangedFromDefault = isChangedFromDefault;
        vm.populateSearchOptions = populateSearchOptions;
        vm.reloadResults = reloadResults;
        vm.restoreResults = restoreResults
        vm.search = search;
        vm.setRefine = setRefine;
        vm.sortCert = utilService.sortCert;
        vm.sortCqm = utilService.sortCqm;
        vm.statusFont = statusFont;
        vm.toggleCompare = toggleCompare;
        vm.truncButton = truncButton;
        vm.viewProduct = viewProduct;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.activeSearch = false;
            vm.resultCount = 0;
            vm.defaultRefineModel = {
                certificationStatus: {
                    'Active': true,
                    'Retired': false,
                    'Suspended by ONC-ACB': true,
                    'Withdrawn by Developer': false,
                    'Withdrawn by Developer Under Surveillance/Review': false,
                    'Withdrawn by ONC-ACB': false,
                    'Suspended by ONC': true,
                    'Terminated by ONC': false
                },
                certificationEdition: {
                    '2011': false,
                    '2014': true,
                    '2015': true
                },
                acb: {
                    'Drummond Group': true,
                    'ICSA Labs': true,
                    'InfoGard': true
                }
            };
            vm.filterItems = {
                pageSize: 50,
                acbItems: [{value: 'Drummond Group', selected: true},
                           {value: 'ICSA Labs', selected: true},
                           {value: 'InfoGard', selected: true}],
                cqms: {
                    2011: [{value: 'NQF-0001', selected: false, display: 'NQF-0001: Asthma Assessment'}, {value: 'NQF-0002', selected: false, display: 'NQF-0002: Appropriate Testing for Children with Pharyngitis'}, {value: 'NQF-0004', selected: false, display: 'NQF-0004: Initiation and Engagement of Alcohol and Other Drug Dependence Treatment: a) Initiation, b) Engagement'}, {value: 'NQF-0012', selected: false, display: 'NQF-0012: Prenatal Care: Screening for Human Immunodeficiency Virus (HIV)'}, {value: 'NQF-0013', selected: false, display: 'NQF-0013: Hypertension: Blood Pressure Measurement'}, {value: 'NQF-0014', selected: false, display: 'NQF-0014: Prenatal Care: Anti-D Immune Globulin'}, {value: 'NQF-0018', selected: false, display: 'NQF-0018: Controlling High Blood Pressure'}, {value: 'NQF-0024', selected: false, display: 'NQF-0024: Weight Assessment and Counseling for Children and Adolescents'}, {value: 'NQF-0027', selected: false, display: 'NQF-0027: Smoking and Tobacco Use Cessation, Medical assistance: a) Advising Smokers and Tobacco Users to Quit, b) Discussing Smoking and Tobacco Use Cessation Medications, c) Discussing Smoking and Tobacco Use Cessation Strategies'}, {value: 'NQF-0028', selected: false, display: 'NQF-0028: Preventive Care and Screening Measure Pair: a) Tobacco Use Assessment b) Tobacco Cessation Intervention'}, {value: 'NQF-0031', selected: false, display: 'NQF-0031: Breast Cancer Screening'}, {value: 'NQF-0032', selected: false, display: 'NQF-0032: Cervical Cancer Screening'}, {value: 'NQF-0033', selected: false, display: 'NQF-0033: Chlamydia Screening for Women'}, {value: 'NQF-0034', selected: false, display: 'NQF-0034: Colorectal Cancer Screening'}, {value: 'NQF-0036', selected: false, display: 'NQF-0036: Use of Appropriate Medications for Asthma'}, {value: 'NQF-0038', selected: false, display: 'NQF-0038: Childhood Immunization Status'}, {value: 'NQF-0041', selected: false, display: 'NQF-0041: Preventive Care and Screening: Influenza Immunization for Patients >= 50 Years Old'}, {value: 'NQF-0043', selected: false, display: 'NQF-0043: Pneumonia Vaccination Status for Older Adults'}, {value: 'NQF-0047', selected: false, display: 'NQF-0047: Asthma Pharmacologic Therapy'}, {value: 'NQF-0052', selected: false, display: 'NQF-0052: Low Back Pain: Use of Imaging Studies'}, {value: 'NQF-0055', selected: false, display: 'NQF-0055: Diabetes: Eye Exam'}, {value: 'NQF-0056', selected: false, display: 'NQF-0056: Diabetes: Foot Exam'}, {value: 'NQF-0059', selected: false, display: 'NQF-0059: Diabetes: HbA1c Poor Control'}, {value: 'NQF-0061', selected: false, display: 'NQF-0061: Diabetes: Blood Pressure Management'}, {value: 'NQF-0062', selected: false, display: 'NQF-0062: Diabetes: Urine Screening'}, {value: 'NQF-0064', selected: false, display: 'NQF-0064: Diabetes: LDL Management & Control'}, {value: 'NQF-0067', selected: false, display: 'NQF-0067: Coronary Artery Disease (CAD): Oral Antiplatelet Therapy Prescribed for Patients with CAD'}, {value: 'NQF-0068', selected: false, display: 'NQF-0068: Ischemic Vascular Disease (IVD): Use of Aspirin or another Antithrombotic'}, {value: 'NQF-0070', selected: false, display: 'NQF-0070: Coronary Artery Disease (CAD): Beta-Blocker Therapy for CAD Patients with Prior Myocardial Infarction (MI)'}, {value: 'NQF-0073', selected: false, display: 'NQF-0073: Ischemic Vascular Disease (IVD): Blood Pressure Management'}, {value: 'NQF-0074', selected: false, display: 'NQF-0074: Coronary Artery Disease (CAD): Drug Therapy for Lowering LDL- Cholesterol'}, {value: 'NQF-0075', selected: false, display: 'NQF-0075: Ischemic Vascular Disease (IVD): Complete Lipid Panel and LDL Control'}, {value: 'NQF-0081', selected: false, display: 'NQF-0081: Heart Failure (HF): Angiotensin- Converting Enzyme (ACE) Inhibitor or Angiotensin Receptor Blocker (ARB) Therapy for Left Ventricular Systolic Dysfunction (LVSD)'}, {value: 'NQF-0083', selected: false, display: 'NQF-0083: Heart Failure (HF): Beta-Blocker Therapy for Left Ventricular Systolic Dysfunction (LVSD)'}, {value: 'NQF-0084', selected: false, display: 'NQF-0084: Heart Failure (HF): Warfarin Therapy Patients with Atrial Fibrillation'}, {value: 'NQF-0086', selected: false, display: 'NQF-0086: Primary Open Angle Glaucoma (POAG): Optic Nerve Evaluation'}, {value: 'NQF-0088', selected: false, display: 'NQF-0088: Diabetic Retinopathy: Documentation of Presence or Absence of Macular Edema and Level of Severity of Retinopathy'}, {value: 'NQF-0089', selected: false, display: 'NQF-0089: Diabetic Retinopathy: Communication with the Physician Managing Ongoing Diabetes Care'}, {value: 'NQF-0105', selected: false, display: 'NQF-0105: Anti-depressant medication management: (a) Effective Acute Phase Treatment, (b) Effective Continuation Phase Treatment'}, {value: 'NQF-0371', selected: false, display: 'NQF-0371: Venous Thromboembolism (VTE)-1 VTE prophylaxis'}, {value: 'NQF-0372', selected: false, display: 'NQF-0372: VTE-2 Intensive Care Unit (ICU) VTE prophylaxis'}, {value: 'NQF-0373', selected: false, display: 'NQF-0373: VTE-3 VTE Patients with Overlap of Anticoagulation Therapy'}, {value: 'NQF-0374', selected: false, display: 'NQF-0374: VTE-4 VTE Patients Unfractionated Heparin (UFH) Dosages/Platelet Count Monitoring by Protocol (or Nomogram) Receiving Unfractionated Heparin (UFH) with Dosages/ Platelet Count Monitored by Protocol (or Nomogram)'}, {value: 'NQF-0375', selected: false, display: 'NQF-0375: VTE-5 VTE discharge instructions'}, {value: 'NQF-0376', selected: false, display: 'NQF-0376: VTE-6 Incidence of potentially preventable VTE'}, {value: 'NQF-0385', selected: false, display: 'NQF-0385: Oncology Colon Cancer: Chemotherapy for Stage III Colon Cancer Patients'}, {value: 'NQF-0387', selected: false, display: 'NQF-0387: Oncology Breast Cancer: Hormonal Therapy for Stage IC- IIIC Estrogen Receptor/Progesterone Receptor (ER/PR) Positive Breast Cancer'}, {value: 'NQF-0389', selected: false, display: 'NQF-0389: Prostate Cancer: Avoidance of Overuse of Bone Scan for Staging Low Risk Prostate Cancer Patients'}, {value: 'NQF-0421', selected: false, display: 'NQF-0421: Adult Weight Screening and Follow-up'}, {value: 'NQF-0435', selected: false, display: 'NQF-0435: Stroke-2 Ischemic stroke - Discharged on anti-thrombotic therapy'}, {value: 'NQF-0436', selected: false, display: 'NQF-0436: Stroke-3 Ischemic stroke - Anticoagulation Therapy for Atrial Fibrillation/Flutter'}, {value: 'NQF-0437', selected: false, display: 'NQF-0437: Stroke-4 Ischemic stroke - Thrombolytic Therapy'}, {value: 'NQF-0438', selected: false, display: 'NQF-0438: Stroke-5 Ischemic stroke - Antithrombotic therapy by end of hospital day two'}, {value: 'NQF-0439', selected: false, display: 'NQF-0439: Stroke-6 Ischemic stroke - Discharged on Statin Medication'}, {value: 'NQF-0440', selected: false, display: 'NQF-0440: Stroke-8 Ischemic or hemorrhagic stroke - Stroke education'}, {value: 'NQF-0441', selected: false, display: 'NQF-0441: Stroke-10 Ischemic or hemorrhagic stroke - Assessed for rehabilitation'}, {value: 'NQF-0495', selected: false, display: 'NQF-0495: Emergency Department (ED)-1 Emergency Department Throughput - Median time from ED arrival to ED departure for admitted ED patients'}, {value: 'NQF-0497', selected: false, display: 'NQF-0497: ED-2 Emergency Department Throughput - Admitted patients - Admit decision time to ED departure time for admitted patients'}, {value: 'NQF-0575', selected: false, display: 'NQF-0575: Diabetes: HbA1c Control (<8%)'}],
                    other: [{value: 'CMS2', selected: false, display: 'CMS2: Preventive Care and Screening: Screening for Clinical Depression and Follow-Up Plan'}, {value: 'CMS2', selected: false, display: 'CMS2: Preventive Care and Screening: Screening for Depression and Follow-Up Plan'}, {value: 'CMS22', selected: false, display: 'CMS22: Preventive Care and Screening: Screening for High Blood Pressure and Follow-Up Documented'}, {value: 'CMS26', selected: false, display: 'CMS26: Home Management Plan of Care (HMPC) Document Given to Patient/Caregiver'}, {value: 'CMS30', selected: false, display: 'CMS30: Statin Prescribed at Discharge'}, {value: 'CMS31', selected: false, display: 'CMS31: Hearing Screening Prior To Hospital Discharge'}, {value: 'CMS32', selected: false, display: 'CMS32: Median Time from ED Arrival to ED Departure for Discharged ED Patients'}, {value: 'CMS50', selected: false, display: 'CMS50: Closing the Referral Loop: Receipt of Specialist Report'}, {value: 'CMS52', selected: false, display: 'CMS52: HIV/AIDS: Pneumocystis Jiroveci Pneumonia (PCP) Prophylaxis'}, {value: 'CMS53', selected: false, display: 'CMS53: Primary PCI Received Within 90 Minutes of Hospital Arrival'}, {value: 'CMS55', selected: false, display: 'CMS55: Median Time from ED Arrival to ED Departure for Admitted ED Patients'}, {value: 'CMS56', selected: false, display: 'CMS56: Functional Status Assessment for Hip Replacemen'}, {value: 'CMS56', selected: false, display: 'CMS56: Functional Status Assessment for Total Hip Replacement'}, {value: 'CMS60', selected: false, display: 'CMS60: Fibrinolytic Therapy Received Within 30 Minutes of Hospital Arrival'}, {value: 'CMS61', selected: false, display: 'CMS61: Preventive Care and Screening: Cholesterol - Fasting Low Density Lipoprotein (LDL-C) Test Performed'}, {value: 'CMS62', selected: false, display: 'CMS62: HIV/AIDS: Medical Visit'}, {value: 'CMS64', selected: false, display: 'CMS64: Preventive Care and Screening: Risk-Stratified Cholesterol -Fasting Low Density Lipoprotein (LDL-C)'}, {value: 'CMS64', selected: false, display: 'CMS64: Preventive Care and Screening: Risk-Stratified Cholesterol -Fasting Low Density Lipoprotein (LDLC)'}, {value: 'CMS65', selected: false, display: 'CMS65: Hypertension: Improvement in Blood Pressure'}, {value: 'CMS66', selected: false, display: 'CMS66: Functional Status Assessment for Knee Replacement'}, {value: 'CMS68', selected: false, display: 'CMS68: Documentation of Current Medications in the Medical Record'}, {value: 'CMS69', selected: false, display: 'CMS69: Preventive Care and Screening: Body Mass Index (BMI) Screening and Follow-Up Plan'}, {value: 'CMS71', selected: false, display: 'CMS71: Anticoagulation Therapy for Atrial Fibrillation/Flutter'}, {value: 'CMS72', selected: false, display: 'CMS72: Antithrombotic Therapy By End of Hospital Day 2'}, {value: 'CMS73', selected: false, display: 'CMS73: Venous Thromboembolism Patients with Anticoagulation Overlap Therapy'}, {value: 'CMS74', selected: false, display: 'CMS74: Primary Caries Prevention Intervention as Offered by Primary Care Providers, including Dentists'}, {value: 'CMS75', selected: false, display: 'CMS75: Children Who Have Dental Decay or Cavities'}, {value: 'CMS77', selected: false, display: 'CMS77: HIV/AIDS: RNA control for Patients with HIV'}, {value: 'CMS82', selected: false, display: 'CMS82: Maternal Depression Screening'}, {value: 'CMS9', selected: false, display: 'CMS9: Exclusive Breast Milk Feeding'}, {value: 'CMS90', selected: false, display: 'CMS90: Functional Status Assessment for Complex Chronic Conditions'}, {value: 'CMS90', selected: false, display: 'CMS90: Functional Status Assessment for Congestive Heart Failure'}, {value: 'CMS91', selected: false, display: 'CMS91: Thrombolytic Therapy'}, {value: 'CMS100', selected: false, display: 'CMS100: Aspirin Prescribed at Discharge'}, {value: 'CMS102', selected: false, display: 'CMS102: Assessed for Rehabilitation'}, {value: 'CMS104', selected: false, display: 'CMS104: Discharged on Antithrombotic Therapy'}, {value: 'CMS105', selected: false, display: 'CMS105: Discharged on Statin Medication'}, {value: 'CMS107', selected: false, display: 'CMS107: Stroke Education'}, {value: 'CMS108', selected: false, display: 'CMS108: Venous Thromboembolism Prophylaxis'}, {value: 'CMS109', selected: false, display: 'CMS109: Venous Thromboembolism Patients Receiving Unfractionated Heparin with Dosages/Platelet Count Monitoring by Protocol or Nomogram'}, {value: 'CMS110', selected: false, display: 'CMS110: Venous Thromboembolism Discharge Instructions'}, {value: 'CMS111', selected: false, display: 'CMS111: Median Admit Decision Time to ED Departure Time for Admitted Patients'}, {value: 'CMS113', selected: false, display: 'CMS113: Elective Delivery'}, {value: 'CMS114', selected: false, display: 'CMS114: Incidence of Potentially-Preventable Venous Thromboembolism'}, {value: 'CMS114', selected: false, display: 'CMS114: Incidence of PotentiallyPreventable Venous Thromboembolism'}, {value: 'CMS117', selected: false, display: 'CMS117: Childhood Immunization Status'}, {value: 'CMS122', selected: false, display: 'CMS122: Diabetes: Hemoglobin A1c (HbA1c) Poor Control (> 9%)'}, {value: 'CMS122', selected: false, display: 'CMS122: Diabetes: Hemoglobin A1c Poor Control'}, {value: 'CMS123', selected: false, display: 'CMS123: Diabetes: Foot Exam'}, {value: 'CMS124', selected: false, display: 'CMS124: Cervical Cancer Screening'}, {value: 'CMS125', selected: false, display: 'CMS125: Breast Cancer Screening'}, {value: 'CMS126', selected: false, display: 'CMS126: Use of Appropriate Medications for Asthma'}, {value: 'CMS127', selected: false, display: 'CMS127: Pneumococcal Vaccination Status for Older Adults'}, {value: 'CMS127', selected: false, display: 'CMS127: Pneumonia Vaccination Status for Older Adults'}, {value: 'CMS128', selected: false, display: 'CMS128: Anti-depressant Medication Management'}, {value: 'CMS129', selected: false, display: 'CMS129: Prostate Cancer: Avoidance of Overuse of Bone Scan for Staging Low Risk Prostate Cancer Patients'}, {value: 'CMS130', selected: false, display: 'CMS130: Colorectal Cancer Screening'}, {value: 'CMS131', selected: false, display: 'CMS131: Diabetes: Eye Exam'}, {value: 'CMS132', selected: false, display: 'CMS132: Cataracts: Complications within 30 Days Following Cataract Surgery Requiring Additional Surgical Procedures'}, {value: 'CMS133', selected: false, display: 'CMS133: Cataracts: 20/40 or Better Visual Acuity within 90 Days Following Cataract Surgery'}, {value: 'CMS134', selected: false, display: 'CMS134: Diabetes: Medical Attention for Nephropathy'}, {value: 'CMS134', selected: false, display: 'CMS134: Diabetes: Urine Protein Screening'}, {value: 'CMS135', selected: false, display: 'CMS135: Heart Failure (HF): Angiotensin-Converting Enzyme (ACE) Inhibitor or Angiotensin Receptor Blocker (ARB) Therapy for Left Ventricular Systolic Dysfunction (LVSD)'}, {value: 'CMS135', selected: false, display: 'CMS135: Heart Failure (HF): AngiotensinConverting Enzyme (ACE) Inhibitor or Angiotensin Receptor Blocker (ARB) Therapy for Left Ventricular Systolic Dysfunction (LVSD)'}, {value: 'CMS136', selected: false, display: 'CMS136: ADHD: Follow-Up Care for Children Prescribed Attention-Deficit/Hyperactivity Disorder (ADHD) Medication'}, {value: 'CMS136', selected: false, display: 'CMS136: ADHD: Follow-Up Care for Children Prescribed AttentionDeficit/Hyperactivi ty Disorder (ADHD) Medication'}, {value: 'CMS137', selected: false, display: 'CMS137: Initiation and Engagement of Alcohol and Other Drug Dependence Treatment'}, {value: 'CMS138', selected: false, display: 'CMS138: Preventive Care and Screening: Tobacco Use: Screening and Cessation Intervention'}, {value: 'CMS139', selected: false, display: 'CMS139: Falls: Screening for Future Fall Risk'}, {value: 'CMS140', selected: false, display: 'CMS140: Breast Cancer: Hormonal Therapy for Stage I (T1b)-IIIC Estrogen Receptor/ Progesterone Receptor (ER/PR) Positive Breast Cancer'}, {value: 'CMS140', selected: false, display: 'CMS140: Breast Cancer: Hormonal Therapy for Stage IC-IIIC Estrogen Receptor/ Progesterone Receptor (ER/PR) Positive Breast Cancer'}, {value: 'CMS141', selected: false, display: 'CMS141: Colon Cancer: Chemotherapy for AJCC Stage III Colon Cancer Patients'}, {value: 'CMS142', selected: false, display: 'CMS142: Diabetic Retinopathy: Communication with the Physician Managing Ongoing Diabetes Care'}, {value: 'CMS143', selected: false, display: 'CMS143: Primary Open Angle Glaucoma (POAG): Optic Nerve Evaluation'}, {value: 'CMS144', selected: false, display: 'CMS144: Heart Failure (HF): Beta-Blocker Therapy for Left Ventricular Systolic Dysfunction (LVSD)'}, {value: 'CMS144', selected: false, display: 'CMS144: Heart Failure (HF): BetaBlocker Therapy for Left Ventricular Systolic Dysfunction (LVSD)'}, {value: 'CMS145', selected: false, display: 'CMS145: Coronary Artery Disease (CAD): Beta-Blocker Therapy-Prior Myocardial Infarction (MI) or Left Ventricular Systolic Dysfunction (LVEF <40%)'}, {value: 'CMS146', selected: false, display: 'CMS146: Appropriate Testing for Children with Pharyngitis'}, {value: 'CMS147', selected: false, display: 'CMS147: Preventive Care and Screening: Influenza Immunization'}, {value: 'CMS148', selected: false, display: 'CMS148: Hemoglobin A1c Test for Pediatric Patients'}, {value: 'CMS149', selected: false, display: 'CMS149: Dementia: Cognitive Assessment'}, {value: 'CMS153', selected: false, display: 'CMS153: Chlamydia Screening for Women'}, {value: 'CMS154', selected: false, display: 'CMS154: Appropriate Treatment for Children with Upper Respiratory Infection (URI)'}, {value: 'CMS155', selected: false, display: 'CMS155: Weight Assessment and Counseling for Nutrition and Physical Activity for Children and Adolescents'}, {value: 'CMS156', selected: false, display: 'CMS156: Use of High-Risk Medications in the Elderly'}, {value: 'CMS157', selected: false, display: 'CMS157: Oncology: Medical and Radiation - Pain Intensity Quantified'}, {value: 'CMS158', selected: false, display: 'CMS158: Pregnant women that had HBsAg testing'}, {value: 'CMS159', selected: false, display: 'CMS159: Depression Remission at Twelve Months'}, {value: 'CMS160', selected: false, display: 'CMS160: Depression Utilization of the PHQ-9 Tool'}, {value: 'CMS161', selected: false, display: 'CMS161: Adult Major Depressive Disorder (MDD): Suicide Risk Assessment'}, {value: 'CMS163', selected: false, display: 'CMS163: Diabetes: Low Density Lipoprotein (LDL) Management'}, {value: 'CMS163', selected: false, display: 'CMS163: Diabetes: Low Density Lipoprotein (LDL-C) Control (< 100 mg/dL)'}, {value: 'CMS164', selected: false, display: 'CMS164: Ischemic Vascular Disease (IVD): Use of Aspirin or Another Antiplatelet'}, {value: 'CMS164', selected: false, display: 'CMS164: Ischemic Vascular Disease (IVD): Use of Aspirin or Another Antithrombotic'}, {value: 'CMS165', selected: false, display: 'CMS165: Controlling High Blood Pressure'}, {value: 'CMS166', selected: false, display: 'CMS166: Use of Imaging Studies for Low Back Pain'}, {value: 'CMS167', selected: false, display: 'CMS167: Diabetic Retinopathy: Documentation of Presence or Absence of Macular Edema and Level of Severity of Retinopathy'}, {value: 'CMS169', selected: false, display: 'CMS169: Bipolar Disorder and Major Depression: Appraisal for alcohol or chemical substance use'}, {value: 'CMS171', selected: false, display: 'CMS171: Prophylactic Antibiotic Received Within One Hour Prior to Surgical Incision'}, {value: 'CMS172', selected: false, display: 'CMS172: Prophylactic Antibiotic Selection for Surgical Patients'}, {value: 'CMS177', selected: false, display: 'CMS177: Child and Adolescent Major Depressive Disorder (MDD): Suicide Risk Assessment'}, {value: 'CMS178', selected: false, display: 'CMS178: Urinary catheter removed on Postoperative Day 1 (POD 1) or Postoperative Day 2 (POD 2) with day of surgery being day zero'}, {value: 'CMS179', selected: false, display: 'CMS179: ADE Prevention and Monitoring: Warfarin Time in Therapeutic Range'}, {value: 'CMS182', selected: false, display: 'CMS182: Ischemic Vascular Disease (IVD): Complete Lipid Panel and LDL Control'}, {value: 'CMS182', selected: false, display: 'CMS182: Ischemic Vascular Disease (IVD): Complete Lipid Panel and LDL-C Control (<100 mg/dL)'}, {value: 'CMS185', selected: false, display: 'CMS185: Healthy Term Newborn'}, {value: 'CMS188', selected: false, display: 'CMS188: Initial Antibiotic Selection for Community-Acquired Pneumonia (CAP) in Immunocompetent Patients'}, {value: 'CMS190', selected: false, display: 'CMS190: Intensive Care Unit Venous Thromboembolism Prophylaxis'}]
                },
                criteria: {
                    2011: [{value: '170.302 (a)', selected: false, display: '170.302 (a): Drug-drug, drug-allergy interaction checks'}, {value: '170.302 (b)', selected: false, display: '170.302 (b): Drug formulary checks'}, {value: '170.302 (c)', selected: false, display: '170.302 (c): Maintain up-to-date problem list'}, {value: '170.302 (d)', selected: false, display: '170.302 (d): Maintain active medication list'}, {value: '170.302 (e)', selected: false, display: '170.302 (e): Maintain active medication allergy list'}, {value: '170.302 (f)(1)', selected: false, display: '170.302 (f)(1): Vital signs'}, {value: '170.302 (f)(2)', selected: false, display: '170.302 (f)(2): Calculate body mass index'}, {value: '170.302 (f)(3)', selected: false, display: '170.302 (f)(3): Plot and display growth charts'}, {value: '170.302 (g)', selected: false, display: '170.302 (g): Smoking status'}, {value: '170.302 (h)', selected: false, display: '170.302 (h): Incorporate laboratory test results'}, {value: '170.302 (i)', selected: false, display: '170.302 (i): Generate patient lists'}, {value: '170.302 (j)', selected: false, display: '170.302 (j): Medication reconciliation'}, {value: '170.302 (k)', selected: false, display: '170.302 (k): Submission to immunization registries'}, {value: '170.302 (l)', selected: false, display: '170.302 (l): Public health surveillance'}, {value: '170.302 (m)', selected: false, display: '170.302 (m): Patient specific education resources'}, {value: '170.302 (n)', selected: false, display: '170.302 (n): Automated measure calculation'}, {value: '170.302 (o)', selected: false, display: '170.302 (o): Access control'}, {value: '170.302 (p)', selected: false, display: '170.302 (p): Emergency access'}, {value: '170.302 (q)', selected: false, display: '170.302 (q): Automatic log-off'}, {value: '170.302 (r)', selected: false, display: '170.302 (r): Audit log'}, {value: '170.302 (s)', selected: false, display: '170.302 (s): Integrity'}, {value: '170.302 (t)', selected: false, display: '170.302 (t): Authentication'}, {value: '170.302 (u)', selected: false, display: '170.302 (u): General encryption'}, {value: '170.302 (v)', selected: false, display: '170.302 (v): Encryption when exchanging electronic health information'}, {value: '170.302 (w)', selected: false, display: '170.302 (w): Accounting of disclosures (optional)'}, {value: '170.304 (a)', selected: false, display: '170.304 (a): Computerized provider order entry'}, {value: '170.304 (b)', selected: false, display: '170.304 (b): Electronic Prescribing'}, {value: '170.304 (c)', selected: false, display: '170.304 (c): Record demographics'}, {value: '170.304 (d)', selected: false, display: '170.304 (d): Patient reminders'}, {value: '170.304 (e)', selected: false, display: '170.304 (e): Clinical decision support'}, {value: '170.304 (f)', selected: false, display: '170.304 (f): Electronic copy of health information'}, {value: '170.304 (g)', selected: false, display: '170.304 (g): Timely access'}, {value: '170.304 (h)', selected: false, display: '170.304 (h): Clinical summaries'}, {value: '170.304 (i)', selected: false, display: '170.304 (i): Exchange clinical information and patient summary record'}, {value: '170.304 (j)', selected: false, display: '170.304 (j): Calculate and submit clinical quality measures'}, {value: '170.306 (a)', selected: false, display: '170.306 (a): Computerized provider order entry'}, {value: '170.306 (b)', selected: false, display: '170.306 (b): Record demographics'}, {value: '170.306 (c)', selected: false, display: '170.306 (c): Clinical decision support'}, {value: '170.306 (d)(1)', selected: false, display: '170.306 (d)(1): Electronic copy of health information'}, {value: '170.306 (d)(2)', selected: false, display: '170.306 (d)(2): Electronic copy of health information'}, {value: '170.306 (e)', selected: false, display: '170.306 (e): Electronic copy of discharge instructions'}, {value: '170.306 (f)', selected: false, display: '170.306 (f): Exchange clinical information and patient summary record'}, {value: '170.306 (g)', selected: false, display: '170.306 (g): Reportable lab results'}, {value: '170.306 (h)', selected: false, display: '170.306 (h): Advance directives'}, {value: '170.306 (i)', selected: false, display: '170.306 (i): Calculate and submit clinical quality measures'}],
                    2014: [{value: '170.314 (a)(1)', selected: false, display: '170.314 (a)(1): Computerized provider order entry'}, {value: '170.314 (a)(2)', selected: false, display: '170.314 (a)(2): Drug-drug, drug-allergy interactions checks'}, {value: '170.314 (a)(3)', selected: false, display: '170.314 (a)(3): Demographics'}, {value: '170.314 (a)(4)', selected: false, display: '170.314 (a)(4): Vital signs, body mass index, and growth Charts'}, {value: '170.314 (a)(5)', selected: false, display: '170.314 (a)(5): Problem list'}, {value: '170.314 (a)(6)', selected: false, display: '170.314 (a)(6): Medication list'}, {value: '170.314 (a)(7)', selected: false, display: '170.314 (a)(7): Medication allergy list'}, {value: '170.314 (a)(8)', selected: false, display: '170.314 (a)(8): Clinical decision support'}, {value: '170.314 (a)(9)', selected: false, display: '170.314 (a)(9): Electronic notes'}, {value: '170.314 (a)(10)', selected: false, display: '170.314 (a)(10): Drug formulary checks'}, {value: '170.314 (a)(11)', selected: false, display: '170.314 (a)(11): Smoking status'}, {value: '170.314 (a)(12)', selected: false, display: '170.314 (a)(12): Image results'}, {value: '170.314 (a)(13)', selected: false, display: '170.314 (a)(13): Family health history'}, {value: '170.314 (a)(14)', selected: false, display: '170.314 (a)(14): Patient list creation'}, {value: '170.314 (a)(15)', selected: false, display: '170.314 (a)(15): Patient-specific education resources'}, {value: '170.314 (a)(16)', selected: false, display: '170.314 (a)(16): Inpatient setting only - electronic medication administration record'}, {value: '170.314 (a)(17)', selected: false, display: '170.314 (a)(17): Advance directives'}, {value: '170.314 (a)(18)', selected: false, display: '170.314 (a)(18): Optional - computerized provider order entry - medications'}, {value: '170.314 (a)(19)', selected: false, display: '170.314 (a)(19): Optional - computerized provider order entry - laboratory'}, {value: '170.314 (a)(20)', selected: false, display: '170.314 (a)(20): Optional - computerized provider order entry - diagnostic imaging'}, {value: '170.314 (b)(1)', selected: false, display: '170.314 (b)(1): Transitions of care - receive, display and incorporate transition of care/referral summaries'}, {value: '170.314 (b)(2)', selected: false, display: '170.314 (b)(2): Transitions of care - create and transmit transition of care/referral summaries'}, {value: '170.314 (b)(3)', selected: false, display: '170.314 (b)(3): Electronic prescribing'}, {value: '170.314 (b)(4)', selected: false, display: '170.314 (b)(4): Clinical information reconciliation'}, {value: '170.314 (b)(5)(A)', selected: false, display: '170.314 (b)(5)(A): Incorporate laboratory tests and values/results'}, {value: '170.314 (b)(5)(B)', selected: false, display: '170.314 (b)(5)(B): Incorporate laboratory tests and values/results'}, {value: '170.314 (b)(6)', selected: false, display: '170.314 (b)(6): Inpatient setting only - transmission of electronic laboratory tests and values/results to ambulatory providers'}, {value: '170.314 (b)(7)', selected: false, display: '170.314 (b)(7): Data portability'}, {value: '170.314 (b)(8)', selected: false, display: '170.314 (b)(8): Optional - transitions of care'}, {value: '170.314 (b)(9)', selected: false, display: '170.314 (b)(9): Optional - clinical information reconciliation and incorporation (CIRI)'}, {value: '170.314 (c)(1)', selected: false, display: '170.314 (c)(1): Clinical quality measures - capture and export'}, {value: '170.314 (c)(2)', selected: false, display: '170.314 (c)(2): Clinical quality measures - import and calculate'}, {value: '170.314 (c)(3)', selected: false, display: '170.314 (c)(3): Clinical quality measures - electronic submission'}, {value: '170.314 (d)(1)', selected: false, display: '170.314 (d)(1): Authentication, access, control, and authorization'}, {value: '170.314 (d)(2)', selected: false, display: '170.314 (d)(2): Auditable events and tamper-resistance'}, {value: '170.314 (d)(3)', selected: false, display: '170.314 (d)(3): Audit report(s)'}, {value: '170.314 (d)(4)', selected: false, display: '170.314 (d)(4): Amendments'}, {value: '170.314 (d)(5)', selected: false, display: '170.314 (d)(5): Automatic log-off'}, {value: '170.314 (d)(6)', selected: false, display: '170.314 (d)(6): Emergency access'}, {value: '170.314 (d)(7)', selected: false, display: '170.314 (d)(7): End-user device encryption'}, {value: '170.314 (d)(8)', selected: false, display: '170.314 (d)(8): Integrity'}, {value: '170.314 (d)(9)', selected: false, display: '170.314 (d)(9): Optional - accounting of disclosures'}, {value: '170.314 (e)(1)', selected: false, display: '170.314 (e)(1): View, download, and transmit to a 3rd party with edge protocol testing'}, {value: '170.314 (e)(2)', selected: false, display: '170.314 (e)(2): Ambulatory setting only -clinical summary'}, {value: '170.314 (e)(3)', selected: false, display: '170.314 (e)(3): Ambulatory setting only - secure messaging'}, {value: '170.314 (f)(1)', selected: false, display: '170.314 (f)(1): Immunization information'}, {value: '170.314 (f)(2)', selected: false, display: '170.314 (f)(2): Transmission to immunization registries'}, {value: '170.314 (f)(3)', selected: false, display: '170.314 (f)(3): Transmission to public health agencies - syndromic surveillance'}, {value: '170.314 (f)(4)', selected: false, display: '170.314 (f)(4): Inpatient setting only - transmission of reportable laboratory tests and values/results'}, {value: '170.314 (f)(5)', selected: false, display: '170.314 (f)(5): Optional - ambulatory setting only - cancer case information'}, {value: '170.314 (f)(6)', selected: false, display: '170.314 (f)(6): Optional - ambulatory setting only - transmission to cancer registries'}, {value: '170.314 (f)(7)', selected: false, display: '170.314 (f)(7): Optional - ambulatory setting only - transmission to public health agencies - syndromic surveillance'}, {value: '170.314 (g)(1)', selected: false, display: '170.314 (g)(1): Automated numerator recording'}, {value: '170.314 (g)(2)', selected: false, display: '170.314 (g)(2): Automated measure calculation'}, {value: '170.314 (g)(3)', selected: false, display: '170.314 (g)(3): Safety-enhanced design'}, {value: '170.314 (g)(4)', selected: false, display: '170.314 (g)(4): Quality management system'}, {value: '170.314 (h)(1)', selected: false, display: '170.314 (h)(1): Optional - Transmit - Applicability Statement for Secure Health'}, {value: '170.314 (h)(2)', selected: false, display: '170.314 (h)(2): Optional - Transmit - Applicability Statement for Secure Health Transport and XDR/XDM for Direct Messaging'}, {value: '170.314 (h)(3)', selected: false, display: '170.314 (h)(3): Optional - Transmit - SOAP Transport and Security Specification and XDR/XDM for Direct Messaging'}],
                    2015: [{value: '170.315 (a)(1)', selected: false, display: '170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications'}, {value: '170.315 (a)(2)', selected: false, display: '170.315 (a)(2): CPOE - Laboratory'}, {value: '170.315 (a)(3)', selected: false, display: '170.315 (a)(3): CPOE - Diagnostic Imaging'}, {value: '170.315 (a)(4)', selected: false, display: '170.315 (a)(4): Drug-Drug, Drug-Allergy Interaction Checks for CPOE'}, {value: '170.315 (a)(5)', selected: false, display: '170.315 (a)(5): Demographics'}, {value: '170.315 (a)(6)', selected: false, display: '170.315 (a)(6): Problem List'}, {value: '170.315 (a)(7)', selected: false, display: '170.315 (a)(7): Medication List'}, {value: '170.315 (a)(8)', selected: false, display: '170.315 (a)(8): Medication Allergy List'}, {value: '170.315 (a)(9)', selected: false, display: '170.315 (a)(9): Clinical Decision Support'}, {value: '170.315 (a)(10)', selected: false, display: '170.315 (a)(10): Drug-Formulary and Preferred Drug List Checks'}, {value: '170.315 (a)(11)', selected: false, display: '170.315 (a)(11): Smoking Status'}, {value: '170.315 (a)(12)', selected: false, display: '170.315 (a)(12): Family Health History'}, {value: '170.315 (a)(13)', selected: false, display: '170.315 (a)(13): Patient-Specific Education Resources'}, {value: '170.315 (a)(14)', selected: false, display: '170.315 (a)(14): Implantable Device List'}, {value: '170.315 (a)(15)', selected: false, display: '170.315 (a)(15): Social, Psychological, and Behavioral Determinants Data'}, {value: '170.315 (b)(1)', selected: false, display: '170.315 (b)(1): Transitions of Care'}, {value: '170.315 (b)(2)', selected: false, display: '170.315 (b)(2): Clinical Information Reconciliation and Incorporation'}, {value: '170.315 (b)(3)', selected: false, display: '170.315 (b)(3): Electronic Prescribing'}, {value: '170.315 (b)(4)', selected: false, display: '170.315 (b)(4): Common Clinical Data Set Summary Record - Create'}, {value: '170.315 (b)(5)', selected: false, display: '170.315 (b)(5): Common Clinical Data Set Summary Record - Receive'}, {value: '170.315 (b)(6)', selected: false, display: '170.315 (b)(6): Data Export'}, {value: '170.315 (b)(7)', selected: false, display: '170.315 (b)(7): Data Segmentation for Privacy - Send'}, {value: '170.315 (b)(8)', selected: false, display: '170.315 (b)(8): Data Segmentation for Privacy - Receive'}, {value: '170.315 (b)(9)', selected: false, display: '170.315 (b)(9): Care Plan'}, {value: '170.315 (c)(1)', selected: false, display: '170.315 (c)(1): Clinical Quality Measures - Record and Export'}, {value: '170.315 (c)(2)', selected: false, display: '170.315 (c)(2): Clinical Quality Measures - Import and Calculate'}, {value: '170.315 (c)(3)', selected: false, display: '170.315 (c)(3): Clinical Quality Measures - Report'}, {value: '170.315 (c)(4)', selected: false, display: '170.315 (c)(4): Clinical Quality Measures - Filter'}, {value: '170.315 (d)(1)', selected: false, display: '170.315 (d)(1): Authentication, Access Control, Authorization'}, {value: '170.315 (d)(2)', selected: false, display: '170.315 (d)(2): Auditable Events and Tamper-Resistance'}, {value: '170.315 (d)(3)', selected: false, display: '170.315 (d)(3): Audit Report(s)'}, {value: '170.315 (d)(4)', selected: false, display: '170.315 (d)(4): Amendments'}, {value: '170.315 (d)(5)', selected: false, display: '170.315 (d)(5): Automatic Access Time-out'}, {value: '170.315 (d)(6)', selected: false, display: '170.315 (d)(6): Emergency Access'}, {value: '170.315 (d)(7)', selected: false, display: '170.315 (d)(7): End-User Device Encryption'}, {value: '170.315 (d)(8)', selected: false, display: '170.315 (d)(8): Integrity'}, {value: '170.315 (d)(9)', selected: false, display: '170.315 (d)(9): Trusted Connection'}, {value: '170.315 (d)(10)', selected: false, display: '170.315 (d)(10): Auditing Actions on Health Information'}, {value: '170.315 (d)(11)', selected: false, display: '170.315 (d)(11): Accounting of Disclosures'}, {value: '170.315 (e)(1)', selected: false, display: '170.315 (e)(1): View, Download, and Transmit to 3rd Party'}, {value: '170.315 (e)(2)', selected: false, display: '170.315 (e)(2): Secure Messaging'}, {value: '170.315 (e)(3)', selected: false, display: '170.315 (e)(3): Patient Health Information Capture'}, {value: '170.315 (f)(1)', selected: false, display: '170.315 (f)(1): Transmission to Immunization Registries'}, {value: '170.315 (f)(2)', selected: false, display: '170.315 (f)(2): Transmission to Public Health Agencies - Syndromic Surveillance'}, {value: '170.315 (f)(3)', selected: false, display: '170.315 (f)(3): Transmission to Public Health Agencies - Reportable Laboratory Tests and Values/Results'}, {value: '170.315 (f)(4)', selected: false, display: '170.315 (f)(4): Transmission to Cancer Registries'}, {value: '170.315 (f)(5)', selected: false, display: '170.315 (f)(5): Transmission to Public Health Agencies - Electronic Case Reporting'}, {value: '170.315 (f)(6)', selected: false, display: '170.315 (f)(6): Transmission to Public Health Agencies - Antimicrobial Use and Resistance Reporting'}, {value: '170.315 (f)(7)', selected: false, display: '170.315 (f)(7): Transmission to Public Health Agencies - Health Care Surveys'}, {value: '170.315 (g)(1)', selected: false, display: '170.315 (g)(1): Automated Numerator Recording'}, {value: '170.315 (g)(2)', selected: false, display: '170.315 (g)(2): Automated Measure Calculation'}, {value: '170.315 (g)(3)', selected: false, display: '170.315 (g)(3): Safety-Enhanced Design'}, {value: '170.315 (g)(4)', selected: false, display: '170.315 (g)(4): Quality Management System'}, {value: '170.315 (g)(5)', selected: false, display: '170.315 (g)(5): Accessibility-Centered Design'}, {value: '170.315 (g)(6)', selected: false, display: '170.315 (g)(6): Consolidated CDA Creation'}, {value: '170.315 (g)(7)', selected: false, display: '170.315 (g)(7): Application Access - Patient Selection'}, {value: '170.315 (g)(8)', selected: false, display: '170.315 (g)(8): Application Access - Data Category Request'}, {value: '170.315 (g)(9)', selected: false, display: '170.315 (g)(9): Application Access - All Data Request'}, {value: '170.315 (h)(1)', selected: false, display: '170.315 (h)(1): Direct Project'}, {value: '170.315 (h)(2)', selected: false, display: '170.315 (h)(2): Direct Project, Edge Protocol, and XDR/XDM'}]
                },
                editionItems: [{ value: '2011', selected: false },
                               { value: '2014', selected: true },
                               { value: '2015', selected: true }],
                statusItems: [{value: 'Active', selected: true},
                              {value: 'Retired', selected: false},
                              {value: 'Suspended by ONC-ACB', selected: true},
                              {value: 'Withdrawn by Developer', selected: false},
                              {value: 'Withdrawn by Developer Under Surveillance/Review', selected: false},
                              {value: 'Withdrawn by ONC-ACB', selected: false},
                              {value: 'Suspended by ONC', selected: true},
                              {value: 'Terminated by ONC', selected: false}]
            };

            if ($localStorage.refineModel) {
                vm.refineModel = $localStorage.refineModel;
            } else {
                vm.refineModel = angular.copy(vm.defaultRefineModel);
            }
            vm.compareCps = [];
            if (!$localStorage.previouslyCompared) {
                $localStorage.previouslyCompared = [];
            }
            vm.previouslyCompared = $localStorage.previouslyCompared;
            if (!$localStorage.previouslyViewed) {
                $localStorage.previouslyViewed = [];
            }
            vm.previouslyViewed = $localStorage.previouslyViewed;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            vm.lookaheadSource = {all: [], developers: [], products: []};
            vm.hasDoneASearch = false;
            $scope.visiblePage = 1;
            vm.boxes = {
                compare: true,
                prevComp: false,
                prevView: false
            };
            if ($localStorage.widget && $localStorage.widget.productIds && $localStorage.widget.productIds.length > 0) {
			    vm.boxes.certificationId = true;
            }
            vm.defaultQuery = {
                orderBy: 'developer',
                sortDescending: false,
                pageNumber: 0,
                pageSize: '50'
            };
            vm.query = angular.copy(vm.defaultQuery);

            vm.restoreResults();
            vm.populateSearchOptions();

            if ($localStorage.clearResults) {
                clear();
                delete $localStorage.clearResults;
            }

            $scope.$on('ClearResults', function () {
                clear();
                delete $localStorage.clearResults;
            });
            commonService.getAll().then(function (response) {
                vm.allCps = response.results;
                vm.displayedCps = [].concat(vm.allCps);
                for (var i = 0; i < vm.displayedCps.length; i++) {
                    vm.displayedCps[i].mainSearch = [vm.displayedCps[i].developer, vm.displayedCps[i].product, vm.displayedCps[i].acbCertificationId, vm.displayedCps[i].chplProductNumber].join('|');
                    vm.displayedCps[i].surveillance = angular.toJson({
                        hasOpenSurveillance: vm.displayedCps[i].hasOpenSurveillance,
                        hasClosedSurveillance: vm.displayedCps[i].hasClosedSurveillance,
                        hasOpenNonconformities: vm.displayedCps[i].hasOpenNonconformities,
                        hasClosedNonconformities: vm.displayedCps[i].hasClosedNonconformities
                    });
                }
            }, function (error) {
                $log.debug(error);
            });
        }

        function clearFilters () {
            delete $localStorage.refineModel;
            delete $localStorage.query;

            var searchTerm, searchTermObject;
            if (vm.query.searchTerm) {
                searchTerm = vm.query.searchTerm;
            }
            if (vm.query.searchTermObject) {
                searchTermObject = vm.query.searchTermObject;
            }
            vm.refineModel = angular.copy(vm.defaultRefineModel);
            vm.query = angular.copy(vm.defaultQuery);
            if (searchTerm) {
                vm.query.searchTerm = searchTerm;
            }
            if (searchTermObject) {
                vm.query.searchTermObject = searchTermObject;
            }
            vm.search();
        }

        function clearPreviouslyCompared () {
            vm.previouslyCompared = [];
            $localStorage.previouslyCompared = [];
        }

        function clearPreviouslyViewed () {
            vm.previouslyViewed = [];
            $localStorage.previouslyViewed = [];
        }

        function clearSurveillanceActivityFilter () {
            vm.refineModel.hasHadSurveillance = undefined;
            vm.refineModel.surveillance = {};
        }

        function certificationStatusFilter (obj) {
            if (!obj.statuses) {
                return true;
            } else {
                return ((obj.statuses['active'] > 0 && vm.refineModel.certificationStatus['Active']) ||
                        (obj.statuses['withdrawnByAcb'] > 0 && vm.refineModel.certificationStatus['Withdrawn by ONC-ACB']) ||
                        (obj.statuses['withdrawnByDeveloper'] > 0 && vm.refineModel.certificationStatus['Withdrawn by Developer']) ||
                        (obj.statuses['withdrawnByDeveloperUnderSurveillanceReview'] > 0 && vm.refineModel.certificationStatus['Withdrawn by Developer Under Surveillance/Review']) ||
                        (obj.statuses['suspendedByAcb'] > 0 && vm.refineModel.certificationStatus['Suspended by ONC-ACB']) ||
                        (obj.statuses['suspendedByOnc'] > 0 && vm.refineModel.certificationStatus['Suspended by ONC']) ||
                        (obj.statuses['terminatedByOnc'] > 0 && vm.refineModel.certificationStatus['Terminated by ONC']) ||
                        (obj.statuses['retired'] > 0 && vm.refineModel.certificationStatus['Retired']));
            }
        }

        function compare () {
            var comparePath = '/compare/';
            var i;
            for (i = 0; i < vm.compareCps.length; i++) {
                comparePath += vm.compareCps[i].id + '&';
            }
            comparePath = comparePath.substring(0, comparePath.length - 1);
            if (comparePath.indexOf('&') > 0) {
                var prev = $localStorage.previouslyCompared;
                var toAdd;
                for (i = 0; i < vm.compareCps.length; i++) {
                    toAdd = true;
                    for (var j = 0; j < prev.length; j++) {
                        if (prev[j].id === vm.compareCps[i].id) {
                            toAdd = false;
                        }
                    }
                    if (toAdd) {
                        prev.push(vm.compareCps[i]);
                    }
                }
                while (prev.length > 20) {
                    prev.shift();
                }
                $localStorage.previouslyCompared = prev;
                $location.url(comparePath);
            }
        }

        function isCategoryChanged (categories) {
            var ret = false;
            for (var i = 0; i < categories.length; i++) {
                angular.forEach(vm.refineModel[categories[i]], function (value, key) {
                    ret = ret || vm.isChangedFromDefault (categories[i], key);
                });
            }
            return ret;
        }

        function isChangedFromDefault (index, data) {
            if (!vm.defaultRefineModel[index]) {
                if (vm.refineModel[index]) {
                    if (angular.isObject(vm.refineModel[index])) {
                        return vm.refineModel[index][data];
                    } else {
                        return true;
                    }
                }
            } else {
                return (vm.defaultRefineModel[index][data] !== vm.refineModel[index][data]);
            }
        }

        function populateSearchOptions () {
            commonService.getSearchOptions() // use 'true' in production, to hide retired CQMs & Certs
                .then(function (options) {
                    var i;
                    vm.certs = options.certificationCriterionNumbers;
                    vm.cqms = options.cqmCriterionNumbers;
                    vm.editions = options.editions;
                    vm.practices = options.practiceTypeNames;
                    vm.certBodies = options.certBodyNames;
                    vm.certificationStatuses = options.certificationStatuses;
                    for (i = 0; i < vm.certificationStatuses.length; i++) {
                        if (vm.certificationStatuses[i].name === 'Pending') {
                            vm.certificationStatuses.splice(i,1);
                            break;
                        }
                    }
                    vm.certsNcqms = options.certificationCriterionNumbers.concat(options.cqmCriterionNumbers);
                    for (i = 0; i < options.developerNames.length; i++) {
                        vm.lookaheadSource.all.push({type: 'developer', value: options.developerNames[i].name, statuses: options.developerNames[i].statuses});
                        vm.lookaheadSource.developers.push({type: 'developer', value: options.developerNames[i].name, statuses: options.developerNames[i].statuses});
                    }
                    for (i = 0; i < options.productNames.length; i++) {
                        vm.lookaheadSource.all.push({type: 'product', value: options.productNames[i].name, statuses: options.productNames[i].statuses});
                        vm.lookaheadSource.products.push({type: 'product', value: options.productNames[i].name, statuses: options.productNames[i].statuses});
                    }
                    $localStorage.lookaheadSource = $scope.lookaheadSource;
                });
        }

        function reloadResults () {
            $log.debug('reloading results');
            $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
            vm.restoreResults();
        }

        function restoreResults () {
            if ($localStorage.searchResults) {
                var nowStamp = Math.floor((new Date()).getTime() / 1000 / 60);
                var difference = nowStamp - $localStorage.searchTimestamp;
                vm.pastTimeout = (difference > CACHE_TIMEOUT)

                vm.hasDoneASearch = true;

                if (!vm.pastTimeout) {
                    $scope.searchResults = $localStorage.searchResults.results;
                    $scope.displayedResults = [].concat($scope.searchResults);
                    vm.activeSearch = true;
                    vm.resultCount = $localStorage.searchResults.recordCount;

                    if ($localStorage.query) {
                        vm.query = $localStorage.query;
                        $scope.visiblePage = vm.query.pageNumber + 1;
                    }
                } else {
                    //vm.reloadResults();
                }
            }
        }

        function search () {
            vm.setRefine();
            if (angular.isDefined(vm.query.searchTermObject)) {
                if (angular.isString(vm.query.searchTermObject) && vm.query.searchTermObject.length > 0) {
                    vm.query.searchTermObject = {type: 'previous search', value: vm.query.searchTermObject};
                    vm.lookaheadSource.all.push(vm.query.searchTermObject);
                }
                vm.query.searchTerm = angular.copy(vm.query.searchTermObject.value);
            } else {
                vm.query.searchTerm = undefined;
            }
            if (angular.isDefined(vm.query.developerObject)) {
                if (angular.isString(vm.query.developerObject) && vm.query.developerObject.length > 0) {
                    vm.query.developerObject = {type: 'previous search', value: vm.query.developerObject};
                    vm.lookaheadSource.developers.push(vm.query.developerObject);
                }
                vm.query.developer = vm.query.developerObject.value;
            } else {
                vm.query.developer = undefined;
            }
            if (angular.isDefined(vm.query.productObject)) {
                if (angular.isString(vm.query.productObject) && vm.query.productObject.length > 0) {
                    vm.query.productObject = {type: 'previous search', value: vm.query.productObject};
                    vm.lookaheadSource.products.push(vm.query.productObject);
                }
                vm.query.product = vm.query.productObject.value;
            } else {
                vm.query.product = undefined;
            }
            $localStorage.lookaheadSource = vm.lookaheadSource;
            $localStorage.refineModel = vm.refineModel;
            commonService.search(vm.query)
                .then(function (data) {
                    vm.hasDoneASearch = true;
                    vm.activeSearch = true;

                    $localStorage.searchResults = data;
                    $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
                    $scope.searchResults = data.results;
                    $scope.displayedResults = [].concat($scope.searchResults);
                    vm.resultCount = data.recordCount;
                }, function () {
                    vm.errorResult();
                });

            $localStorage.query = vm.query;
        }

        function setRefine () {
            vm.query.certificationBodies = [];
            vm.query.certificationCriteria = [];
            vm.query.certificationEditions = [];
            vm.query.certificationStatuses = [];
            vm.query.cqms = [];
            vm.query.surveillance = [];
            vm.query.practiceType = vm.refineModel.practiceType;
            if (vm.refineModel.developer) {
                vm.query.developerObject = vm.refineModel.developer;
            } else {
                vm.query.developerObject = undefined;
            }
            if (vm.refineModel.product) {
                vm.query.productObject = vm.refineModel.product;
            } else {
                vm.query.productObject = undefined;
            }
            vm.query.version = vm.refineModel.version;

            angular.forEach(vm.refineModel.acb, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationBodies);
            angular.forEach(vm.refineModel.certificationCriteria, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationCriteria);
            angular.forEach(vm.refineModel.certificationEdition, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationEditions);
            angular.forEach(vm.refineModel.certificationStatus, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.certificationStatuses);
            angular.forEach(vm.refineModel.cqms, function (value, key) {
                if (value) { this.push(key); }
            }, vm.query.cqms);
            if (vm.refineModel.hasHadSurveillance === 'has-had') {
                vm.query.hasHadSurveillance = true;
                angular.forEach(vm.refineModel.surveillance, function (value, key) {
                    if (value) { this.push(key); }
                }, vm.query.surveillance);
            } else if (vm.refineModel.hasHadSurveillance === 'never') {
                vm.query.hasHadSurveillance = false;
            }
        }

        function statusFont (status) {
            var ret;
            switch (status) {
            case 'Active':
                ret = 'fa-check-circle status-good';
                break;
            case 'Retired':
                ret = 'fa-university status-neutral';
                break;
            case 'Suspended by ONC':
                ret = 'fa-minus-square status-warning';
                break;
            case 'Suspended by ONC-ACB':
                ret = 'fa-minus-circle status-warning';
                break;
            case 'Terminated by ONC':
                ret = 'fa-window-close status-bad';
                break;
            case 'Withdrawn by Developer Under Surveillance/Review':
                ret = 'fa-exclamation-circle status-bad';
                break;
            case 'Withdrawn by Developer':
                ret = 'fa-stop-circle status-neutral';
                break;
            case 'Withdrawn by ONC-ACB':
                ret = 'fa-times-circle status-bad';
                break;
            }
            return ret;
        }

        function toggleCompare (row) {
            var toAdd = true;
            for (var i = 0; i < vm.compareCps.length; i++) {
                if (vm.compareCps[i].id === row.id) {
                    vm.compareCps.splice(i,1);
                    toAdd = false;
                }
            }
            if (toAdd) {
                vm.compareCps.push(row);
            }
            vm.boxes.compare = true;
        }

        function truncButton (str) {
            var ret = str;
            if (str.length > 20) {
                ret = ret.substring(0,20) + '&#8230;';
            }
            ret +='<span class="pull-right"><i class="fa fa-close"></i></span><span class="sr-only">Remove ' + str + ' from compare</span>';
            return ret;
        }

        function viewProduct (cp) {
            var toAdd = true;
            for (var i = 0; i < vm.previouslyViewed.length; i++) {
                if (vm.previouslyViewed[i].id === cp.id) {
                    toAdd = false;
                }
            }
            if (toAdd) {
                vm.previouslyViewed.push(cp);
                if (vm.previouslyViewed.length > 20) {
                    vm.previouslyViewed.shift();
                }
                $localStorage.previouslyViewed = vm.previouslyViewed;
            }
            $location.url('/product/' + cp.id);
        }


        $scope.prepend = function (name) {
            if (name.substring(0,3) !== 'CMS') {
                return 'NQF-' + name;
            } else {
                return name;
            }
        };

        $scope.hasResults = function () {
            return angular.isDefined($scope.searchResults) && $scope.searchResults.length > 0;
        };

        $scope.hasSearched = function () {
            return vm.hasDoneASearch && vm.activeSearch;
        };

        $scope.browseAll = function () {
            $scope.clear();
            vm.activeSearch = true;
            vm.search();
        };

        vm.errorResult = function () {
            delete $localStorage.searchResults;
            vm.hasDoneASearch = true;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            $scope.visiblePage = 1;
            vm.resultCount = 0;
            vm.compareCps = [];
        };

        function clear () {
            delete $localStorage.searchResults;
            delete $localStorage.query;
            delete $localStorage.lookaheadSource;
            delete $localStorage.refine;
            $scope.searchResults = [];
            $scope.displayedResults = [];
            $scope.visiblePage = 1;
            vm.resultCount = 0;
            vm.compareCps = [];
            vm.hasDoneASearch = false;
            vm.activeSearch = false;
            vm.query = angular.copy(vm.defaultQuery);
            vm.refineType = '';
            vm.refineModel = angular.copy(vm.defaultRefineModel);
            if (vm.searchForm) {
                vm.searchForm.$setPristine();
            }
        }
        $scope.clear = clear;

        $scope.sort = function (header) {
            if (header === vm.query.orderBy) {
                vm.query.sortDescending = !vm.query.sortDescending;
            } else {
                vm.query.sortDescending = false;
                vm.query.orderBy = header;
            }
            vm.search();
        }

        $scope.pageChanged = function (pageNumber) {
            vm.query.pageNumber = pageNumber - 1;
            vm.search();
        };
    }
})();
