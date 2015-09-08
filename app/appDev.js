;(function () {
    'use strict';

    /*****************************************************
     * This section is dummy data until the API can be wired up
     */
    var totalResults = 400;
    var allProducts = [];
    var words = ['Aliquam', 'Erat', 'Volutpat', 'Nunc', 'Eleifend', 'Leo', 'Vitae', 'Magna', 'In', 'Id', 'Erat', 'Non', 'Orci', 'Commodo', 'Lobortis', 'Proin', 'Neque', 'Massa', 'Cursus', 'Ut', 'Gravida', 'Ut', 'Lobortis', 'Eget', 'Lacus', 'Sed', 'Diam', 'Praesent', 'Fermentum', 'Tempor', 'Tellus', 'Nullam', 'Tempus', 'Mauris', 'Ac', 'Felis', 'Vel', 'Velit', 'Tristique', 'Imperdiet', 'Donec', 'At', 'Pede', 'Etiam', 'Vel', 'Neque', 'Nec', 'Dui', 'Dignissim', 'Bibendum', 'Vivamus', 'Id', 'Enim', 'Phasellus', 'Neque', 'Orci', 'Porta', 'A', 'Aliquet', 'Quis', 'Semper', 'A', 'Massa', 'Phasellus', 'Purus', 'Pellentesque', 'Tristique', 'Imperdiet', 'Tortor', 'Nam', 'Euismod', 'Tellus', 'Id', 'Erat', 'Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetuer', 'Adipiscing', 'Elit', 'Donec', 'Hendrerit', 'Tempor', 'Tellus', 'Donec', 'Pretium', 'Posuere', 'Tellus', 'Proin', 'Quam', 'Nisl', 'Tincidunt', 'Et', 'Mattis', 'Eget', 'Convallis', 'Nec', 'Purus', 'Sociis', 'Natoque', 'Penatibus', 'Et', 'Magnis', 'Dis', 'Parturient', 'Montes', 'Nascetur', 'Ridiculus', 'Mus', 'Nulla', 'Posuere', 'Donec', 'Vitae', 'Dolor', 'Nullam', 'Tristique', 'Diam', 'Non', 'Turpis', 'Cras', 'Placerat', 'Accumsan', 'Nulla', 'Nullam', 'Rutrum', 'Nam', 'Vestibulum', 'Accumsan', 'Nisl'];
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];
    var vendorList = Object.create(null);
    var productList = Object.create(null);
    var certBodies = ['InfoGard', 'CCHIT', 'Drummond Group Inc.', 'SLI Global', 'Surescripts LLC', 'ICSA Labs'];
    var allCerts = [
        { title: '2011 Certifications', certs: [{ hasVersion: false, number: '170.302(a)', title: 'Drug-drug, drug-allergy' },{ hasVersion: false, number: '170.302(b)', title: 'Drug formulary checks' },{ hasVersion: false, number: '170.302(c)', title: 'Maintain up-to-date prob' },{ hasVersion: false, number: '170.302(d)', title: 'Maintain active med list' },{ hasVersion: false, number: '170.302(e)', title: 'Maintain active allergy list' },{ hasVersion: false, number: '170.302(f)', title: 'Record and Chart Vital Signs' },{ hasVersion: false, number: '170.302(f)(1)', title: 'Record and Chart Vital' },{ hasVersion: false, number: '170.302(f)(2)', title: 'Calculate BMI' },{ hasVersion: false, number: '170.302(f)(3)', title: 'Plot and display growth' },{ hasVersion: false, number: '170.302(g)', title: 'Smoking status' },{ hasVersion: false, number: '170.302(h)', title: 'Incorporate lab test results' },{ hasVersion: false, number: '170.302(i)', title: 'Generate patient lists' },{ hasVersion: false, number: '170.302(j)', title: 'Medication Reconciliation' },{ hasVersion: false, number: '170.302(k)', title: 'Submission to immun' },{ hasVersion: false, number: '170.302(l)', title: 'Public Health Surveillance' },{ hasVersion: false, number: '170.302(m)', title: 'Patient Specific Education' },{ hasVersion: false, number: '170.302(n)', title: 'Automated measure calc' },{ hasVersion: false, number: '170.302(o)', title: 'Access Control' },{ hasVersion: false, number: '170.302(p)', title: 'Emergency Access' },{ hasVersion: false, number: '170.302(q)', title: 'Automatic log-off' },{ hasVersion: false, number: '170.302(r)', title: 'Audit Log' },{ hasVersion: false, number: '170.302(s)', title: 'Integrity' },{ hasVersion: false, number: '170.302(t)', title: 'Authentication' },{ hasVersion: false, number: '170.302(u)', title: 'General Encryption' },{ hasVersion: false, number: '170.302(v)', title: 'Encryption when exchanging' },{ hasVersion: false, number: '170.302(w)', title: 'Accounting of disclosures' },{ hasVersion: false, number: '170.304(a)', title: 'Computerized provider OE' },{ hasVersion: false, number: '170.304(b)', title: 'Electronic Prescribing' },{ hasVersion: false, number: '170.304(c)', title: 'Record Demographics' },{ hasVersion: false, number: '170.304(d)', title: 'Patient Reminders' },{ hasVersion: false, number: '170.304(e)', title: 'Clinical Decision Support' },{ hasVersion: false, number: '170.304(f)', title: 'Electronic Copy of Health' },{ hasVersion: false, number: '170.304(g)', title: 'Timely Access' },{ hasVersion: false, number: '170.304(h)', title: 'Clinical Summaries' },{ hasVersion: false, number: '170.304(i)', title: 'Exchange Clinical Info' },{ hasVersion: false, number: '170.304(j)', title: 'Calculate and Submit Clinical' },{ hasVersion: false, number: '170.306(a)', title: 'Computerized Provider OE' },{ hasVersion: false, number: '170.306(b)', title: 'Record Demographics' },{ hasVersion: false, number: '170.306(c)', title: 'Clinical Decision Support' },{ hasVersion: false, number: '170.306(d)', title: 'Electronic copy of Health Inf' },{ hasVersion: false, number: '170.306(d)(1)', title: 'Electronic copy of health' },{ hasVersion: false, number: '170.306(d)(2)', title: 'E-copy of health info' },{ hasVersion: false, number: '170.306(e)', title: 'Electronic copy of discharge' },{ hasVersion: false, number: '170.306(f)', title: 'Exchange Clinical Info' },{ hasVersion: false, number: '170.306(g)', title: 'Reportable Lab Results' },{ hasVersion: false, number: '170.306(h)', title: 'Advance Directives' },{ hasVersion: false, number: '170.306(i)', title: 'Calculate and Submit Clinical' }]},
        { title: '2014 Certifications', certs: [{ hasVersion: false, number: '170.314(a)(1)', title: 'Computerized provider OE' },{ hasVersion: false, number: '170.314(a)(2)', title: 'Drug-drug, drug-allergy' },{ hasVersion: false, number: '170.314(a)(3)', title: 'Demographics' },{ hasVersion: false, number: '170.314(a)(4)', title: 'Vital signs, body mass ind' },{ hasVersion: false, number: '170.314(a)(5)', title: 'Problem List' },{ hasVersion: false, number: '170.314(a)(6)', title: 'Medication List' },{ hasVersion: false, number: '170.314(a)(7)', title: 'Medication Allergy List' },{ hasVersion: false, number: '170.314(a)(8)', title: 'Clinical Decision Support' },{ hasVersion: false, number: '170.314(a)(9)', title: 'Electronic Notes' },{ hasVersion: false, number: '170.314(a)(10)', title: 'Drug-Formulary Checks' },{ hasVersion: false, number: '170.314(a)(11)', title: 'Smoking Status' },{ hasVersion: false, number: '170.314(a)(12)', title: 'Image Results' },{ hasVersion: false, number: '170.314(a)(13)', title: 'Family Health History' },{ hasVersion: false, number: '170.314(a)(14)', title: 'Patient List Creation' },{ hasVersion: false, number: '170.314(a)(15)', title: 'Patient-Specific Educatio' },{ hasVersion: false, number: '170.314(a)(16)', title: 'Electronic Medication Adm' },{ hasVersion: false, number: '170.314(a)(17)', title: 'Advance Directives' },{ hasVersion: false, number: '170.314(a)(18)', title: 'Cmp pvdr order entry-med' },{ hasVersion: false, number: '170.314(a)(19)', title: 'Cmp pvdr order entry-lab' },{ hasVersion: false, number: '170.314(a)(20)', title: 'Cmp pvdr order entry-DI' },{ hasVersion: false, number: '170.314(b)(1)', title: 'Transitions of Care - rece' },{ hasVersion: false, number: '170.314(b)(2)', title: 'Transitions of Care - crea' },{ hasVersion: false, number: '170.314(b)(3)', title: 'Electronic Prescribing' },{ hasVersion: false, number: '170.314(b)(4)', title: 'Clinical Information Recon' },{ hasVersion: false, number: '170.314(b)(5)', title: 'Incorporate Laboratory Tes' },{ hasVersion: false, number: '170.314(b)(6)', title: 'Transmission of Electronic' },{ hasVersion: false, number: '170.314(b)(7)', title: 'Data Portability' },{ hasVersion: false, number: '170.314(b)(8)', title: 'Transitions of care' },{ hasVersion: false, number: '170.314(b)(9)', title: 'Clinic info recon and inc' },{ hasVersion: false, number: '170.314(c)(1)', title: 'Clinical Quality Measures' },{ hasVersion: false, number: '170.314(c)(2)', title: 'Clinical Quality Measures' },{ hasVersion: false, number: '170.314(c)(3)', title: 'Clinical Quality Measures' },{ hasVersion: false, number: '170.314(d)(1)', title: 'Authentication, access con' },{ hasVersion: false, number: '170.314(d)(2)', title: 'Auditable Events and Tampe' },{ hasVersion: false, number: '170.314(d)(3)', title: 'Audit Report(s)' },{ hasVersion: false, number: '170.314(d)(4)', title: 'Amendments' },{ hasVersion: false, number: '170.314(d)(5)', title: 'Automatic log-off' },{ hasVersion: false, number: '170.314(d)(6)', title: 'Emergency access' },{ hasVersion: false, number: '170.314(d)(7)', title: 'End-User Device Encryption' },{ hasVersion: false, number: '170.314(d)(8)', title: 'Integrity' },{ hasVersion: false, number: '170.314(d)(9)', title: 'Accounting of Disclosures' },{ hasVersion: false, number: '170.314(e)(1)', title: 'View, Download, and Transm' },{ hasVersion: false, number: '170.314(e)(2)', title: 'Clinical Summary' },{ hasVersion: false, number: '170.314(e)(3)', title: 'Secure Messaging' },{ hasVersion: false, number: '170.314(f)(1)', title: 'Immunization Information' },{ hasVersion: false, number: '170.314(f)(2)', title: 'Transmission to Immunizati' },{ hasVersion: false, number: '170.314(f)(3)', title: 'Transmission to Public Hea' },{ hasVersion: false, number: '170.314(f)(4)', title: 'Transmission of Reportable' },{ hasVersion: false, number: '170.314(f)(5)', title: 'Cancer Case Information' },{ hasVersion: false, number: '170.314(f)(6)', title: 'Transmission to Cancer Reg' },{ hasVersion: false, number: '170.314(f)(7)', title: 'Transm to agencies-syndrom' },{ hasVersion: false, number: '170.314(g)(1)', title: 'Automated Numerator Record' },{ hasVersion: false, number: '170.314(g)(2)', title: 'Automated Measure Calculat' },{ hasVersion: false, number: '170.314(g)(3)', title: 'Safety-Enhanced Design' },{ hasVersion: false, number: '170.314(g)(4)', title: 'Quality Management System' },{ hasVersion: false, number: '170.314(h)(1)', title: 'App Stmt Sec Hlth Trans' },{ hasVersion: false, number: '170.314(h)(2)', title: 'Trnsprt Direct Msg'},{ hasVersion: false, number: '170.314(h)(3)', title: 'SOAP Trnsprt Direct' }]},
        { title: 'Clinical Quality Measures', certs: [{ hasVersion: false, number: 'NQF 0001(A)', title: 'Asthma Assessment' },{ hasVersion: false, number: 'NQF 0002(A)', title: 'Pharyngitis Testing' },{ hasVersion: false, number: 'NQF 0004(A)', title: 'Alcohol and Other Drug Depe' },{ hasVersion: false, number: 'NQF 0012(A)', title: 'Prenatal Care: HIV' },{ hasVersion: false, number: 'NQF 0013(A)', title: 'Hypertension: Blood Pressure' },{ hasVersion: false, number: 'NQF 0014(A)', title: 'Prenatal Care: Immune Globul' },{ hasVersion: false, number: 'NQF 0018(A)', title: 'Controlling High Blood Pres' },{ hasVersion: false, number: 'NQF 0024(A)', title: 'Weight Assessment for Child' },{ hasVersion: false, number: 'NQF 0027(A)', title: 'Smoking and Tobacco Use' },{ hasVersion: false, number: 'NQF 0028(A)', title: 'Preventive Care & Screening' },{ hasVersion: false, number: 'NQF 0031(A)', title: 'Breast Cancer Screening' },{ hasVersion: false, number: 'NQF 0032(A)', title: 'Cervical Cancer Screening' },{ hasVersion: false, number: 'NQF 0033(A)', title: 'Chlamydia Screening for Wome' },{ hasVersion: false, number: 'NQF 0034(A)', title: 'Colorectal Cancer Screening' },{ hasVersion: false, number: 'NQF 0036(A)', title: 'Use of Medication for Asthma' },{ hasVersion: false, number: 'NQF 0038(A)', title: 'Child Immunization Status' },{ hasVersion: false, number: 'NQF 0041(A)', title: 'Preventive Care & Screening' },{ hasVersion: false, number: 'NQF 0043(A)', title: 'Pneomonia Vaccination Status' },{ hasVersion: false, number: 'NQF 0047(A)', title: 'Asthma Pharmacologic Therapy' },{ hasVersion: false, number: 'NQF 0052(A)', title: 'Low Back Pain: Imaging' },{ hasVersion: false, number: 'NQF 0055(A)', title: 'Diabetes: Eye Exam' },{ hasVersion: false, number: 'NQF 0056(A)', title: 'Diabetes: Foot Exam' },{ hasVersion: false, number: 'NQF 0059(A)', title: 'Diabetes: Hemoglobin A1c' },{ hasVersion: false, number: 'NQF 0061(A)', title: 'Diabetes: BP Management' },{ hasVersion: false, number: 'NQF 0062(A)', title: 'Diabates: Urine Screening' },{ hasVersion: false, number: 'NQF 0064(A)', title: 'Diabetes: LDL' },{ hasVersion: false, number: 'NQF 0067(A)', title: 'Coronary Artery Disease' },{ hasVersion: false, number: 'NQF 0068(A)', title: 'Vascular Disease: Aspirin' },{ hasVersion: false, number: 'NQF 0070(A)', title: 'CAD: Beta-Blocker Therapy' },{ hasVersion: false, number: 'NQF 0073(A)', title: 'Vascular Disease: BP Mgmt' },{ hasVersion: false, number: 'NQF 0074(A)', title: 'Coronary Artery Disease' },{ hasVersion: false, number: 'NQF 0075(A)', title: 'Vascular Disease: LDL' },{ hasVersion: false, number: 'NQF 0081(A)', title: 'Heart Failure: ACE Inhibitor' },{ hasVersion: false, number: 'NQF 0083(A)', title: 'Heart Failure: LVSD Therapy' },{ hasVersion: false, number: 'NQF 0084(A)', title: 'Heart Failure: Warfarin' },{ hasVersion: false, number: 'NQF 0086(A)', title: 'Primary Open Angle Glaucoma' },{ hasVersion: false, number: 'NQF 0088(A)', title: 'Diabetic Retinopathy: Docs' },{ hasVersion: false, number: 'NQF 0089(A)', title: 'Diabetic Retinopathy: Com' },{ hasVersion: false, number: 'NQF 0105(A)', title: 'Anti-depressant Med Mgmt' },{ hasVersion: false, number: 'NQF 0371(I)', title: 'VTE: Prophylaxis' },{ hasVersion: false, number: 'NQF 0372(I)', title: 'VTE: Intensive Care Unit' },{ hasVersion: false, number: 'NQF 0373(I)', title: 'VTE: Anticoagulation Overlap' },{ hasVersion: false, number: 'NQF 0374(I)', title: 'VTE: Platelet Monitoring' },{ hasVersion: false, number: 'NQF 0375(I)', title: 'VTE: Discharge Instructions' },{ hasVersion: false, number: 'NQF 0376(I)', title: 'VTE: Incidence of Preventabl' },{ hasVersion: false, number: 'NQF 0385(A)', title: 'Oncology Colon Cancer' },{ hasVersion: false, number: 'NQF 0387(A)', title: 'Oncology Brest Cancer' },{ hasVersion: false, number: 'NQF 0389(A)', title: 'Prostate Cancer: Bone Scan' },{ hasVersion: false, number: 'NQF 0421(A)', title: 'Adult Weight Screening' },{ hasVersion: false, number: 'NQF 0435(I)', title: 'Stroke: Discharge' },{ hasVersion: false, number: 'NQF 0436(I)', title: 'Stroke: Anticoagulation' },{ hasVersion: false, number: 'NQF 0437(I)', title: 'Stroke: Thrombolytic' },{ hasVersion: false, number: 'NQF 0438(I)', title: 'Stroke: Ischemic/Hemorrhagic' },{ hasVersion: false, number: 'NQF 0439(I)', title: 'Stroke: Discharge on Statins' },{ hasVersion: false, number: 'NQF 0440(I)', title: 'Stroke: Stroke Education' },{ hasVersion: false, number: 'NQF 0441(I)', title: 'Stroke: Rehabilitation' },{ hasVersion: false, number: 'NQF 0495(I)', title: 'ED: Median Time' },{ hasVersion: false, number: 'NQF 0497(I)', title: 'ED: Admission Decision' },{ hasVersion: false, number: 'NQF 0575(A)', title: 'Diabetes: Hemoglobin A1c' },{ hasVersion: true, number: 'CMS100', title: 'AMI-2-Aspirin Prescribed at Dis' },{ hasVersion: true, number: 'CMS102', title: 'Stroke-10 Ischemic or hemorrhag' },{ hasVersion: true, number: 'CMS104', title: 'Stroke-2 Ischemic stroke - Dis' },{ hasVersion: true, number: 'CMS105', title: 'Stroke-6 Ischemic stroke - Disc' },{ hasVersion: true, number: 'CMS107', title: 'Stroke-8 Ischemic or hemorrhagi' },{ hasVersion: true, number: 'CMS108', title: 'Venous Thromboembolism (VTE)-1' },{ hasVersion: true, number: 'CMS109', title: 'VTE-4 VTE Patients Receiving Un' },{ hasVersion: true, number: 'CMS110', title: 'VTE-5 VTE discharge instruction' },{ hasVersion: true, number: 'CMS111', title: 'ED-2 Emergency Department Throu' },{ hasVersion: true, number: 'CMS113', title: 'PC-01 Elective Delivery Prior t' },{ hasVersion: true, number: 'CMS114', title: 'VTE-6 Incidence of potentially' },{ hasVersion: true, number: 'CMS117', title: 'Childhood Immunization Status' },{ hasVersion: true, number: 'CMS122', title: 'Diabetes: Hemoglobin A1c Poor' },{ hasVersion: true, number: 'CMS123', title: 'Diabetes: Foot Exam' },{ hasVersion: true, number: 'CMS124', title: 'Cervical Cancer Screening' },{ hasVersion: true, number: 'CMS125', title: 'Breast Cancer Screening' },{ hasVersion: true, number: 'CMS126', title: 'Use of Appropriate Medications' },{ hasVersion: true, number: 'CMS127', title: 'Pneumonia Vaccination Status fo' },{ hasVersion: true, number: 'CMS128', title: 'Anti-depressant Medication Mana' },{ hasVersion: true, number: 'CMS129', title: 'Prostate Cancer: Avoidance of' },{ hasVersion: true, number: 'CMS130', title: 'Colorectal Cancer Screening' },{ hasVersion: true, number: 'CMS131', title: 'Diabetes: Eye Exam' },{ hasVersion: true, number: 'CMS132', title: 'Cataracts: Complications withi' },{ hasVersion: true, number: 'CMS133', title: 'Cataracts: 20/40 or Better Vis' },{ hasVersion: true, number: 'CMS134', title: 'Diabetes: Urine Protein Screen' },{ hasVersion: true, number: 'CMS135', title: 'Heart Failure (HF): Angiotensi' },{ hasVersion: true, number: 'CMS136', title: 'ADHD: Follow-Up Care for Child' },{ hasVersion: true, number: 'CMS137', title: 'Initiation and Engagement of Al' },{ hasVersion: true, number: 'CMS138', title: 'Preventive Care and Screening:' },{ hasVersion: true, number: 'CMS139', title: 'Screening for Future Fall Risk' },{ hasVersion: true, number: 'CMS140', title: 'Breast Cancer: Hormonal Therapy' },{ hasVersion: true, number: 'CMS141', title: 'Colon Cancer: Chemotherapy for' },{ hasVersion: true, number: 'CMS142', title: 'Diabetic Retinopathy: Communic' },{ hasVersion: true, number: 'CMS143', title: 'Primary Open Angle Glaucoma (PO' },{ hasVersion: true, number: 'CMS144', title: 'Heart Failure (HF): Beta-Block' },{ hasVersion: true, number: 'CMS145', title: 'Coronary Artery Disease (CAD):' },{ hasVersion: true, number: 'CMS146', title: 'Appropriate Testing for Childre' },{ hasVersion: true, number: 'CMS147', title: 'Preventative Care and Screening' },{ hasVersion: true, number: 'CMS148', title: 'Hemoglobin A1c Test for Pediatr' },{ hasVersion: true, number: 'CMS149', title: 'Dementia: Cognitive Assessment' },{ hasVersion: true, number: 'CMS153', title: 'Chlamydia Screening for Women' },{ hasVersion: true, number: 'CMS154', title: 'Appropriate Treatment for Child' },{ hasVersion: true, number: 'CMS155', title: 'Weight Assessment and Counselin' },{ hasVersion: true, number: 'CMS156', title: 'Use of High-Risk Medications in' },{ hasVersion: true, number: 'CMS157', title: 'Oncology: Medical and Radiatio' },{ hasVersion: true, number: 'CMS158', title: 'Pregnant women that had HBsAg t' },{ hasVersion: true, number: 'CMS159', title: 'Depression Remission at Twelve' },{ hasVersion: true, number: 'CMS160', title: 'Depression Utilization of the P' },{ hasVersion: true, number: 'CMS161', title: 'Major Depressive Disorder (MDD)' },{ hasVersion: true, number: 'CMS163', title: 'Diabetes: Low Density Lipoprot' },{ hasVersion: true, number: 'CMS164', title: 'Ischemic Vascular Disease (IVD)' },{ hasVersion: true, number: 'CMS165', title: 'Controlling High Blood Pressure' },{ hasVersion: true, number: 'CMS166', title: 'Use of Imaging Studies for Low' },{ hasVersion: true, number: 'CMS167', title: 'Diabetic Retinopathy: Document' },{ hasVersion: true, number: 'CMS169', title: 'Bipolar Disorder and Major Depr' },{ hasVersion: true, number: 'CMS171', title: 'SCIP-INF-1 Prophylactic Antibio' },{ hasVersion: true, number: 'CMS172', title: 'SCIP-INF-2-Prophylactic Antibio' },{ hasVersion: true, number: 'CMS177', title: 'Child and Adolescent Major Depr' },{ hasVersion: true, number: 'CMS178', title: 'SCIP-INF-9- Urinary catheter re' },{ hasVersion: true, number: 'CMS179', title: 'ADE Prevention and Monitoring:' },{ hasVersion: true, number: 'CMS182', title: 'Ischemic Vascular Disease (IVD)' },{ hasVersion: true, number: 'CMS185', title: 'Healthy Term Newborn' },{ hasVersion: true, number: 'CMS188', title: 'PN-6- Initial Antibiotic Select' },{ hasVersion: true, number: 'CMS190', title: 'VTE-2 Intensive Care Unit (ICU)' },{ hasVersion: true, number: 'CMS22', title: 'Preventive Care and Screening:' },{ hasVersion: true, number: 'CMS26V1', title: 'Home Management Plan of Care (H' },{ hasVersion: true, number: 'CMS2', title: 'Preventive Care and Screening: S' },{ hasVersion: true, number: 'CMS30', title: 'AMI-10 Statin Prescribed at Disc' },{ hasVersion: true, number: 'CMS31', title: 'EHDI-1a - Hearing screening prio' },{ hasVersion: true, number: 'CMS32', title: 'ED-3-Median time from ED arrival' },{ hasVersion: true, number: 'CMS50', title: 'Closing the referral loop: rece' },{ hasVersion: true, number: 'CMS52', title: 'HIV/AIDS: Pneumocystis jiroveci' },{ hasVersion: true, number: 'CMS53', title: 'AMI-8a- Primary PCI Received Wit' },{ hasVersion: true, number: 'CMS55', title: 'Emergency Department (ED)-1 Emer' },{ hasVersion: true, number: 'CMS56', title: 'Functional status assessment for' },{ hasVersion: true, number: 'CMS60', title: 'AMI-7a- Fibrinolytic Therapy Rec' },{ hasVersion: true, number: 'CMS61', title: 'Preventive Care and Screening:' },{ hasVersion: true, number: 'CMS62', title: 'HIV/AIDS: Medical Visit' },{ hasVersion: true, number: 'CMS64', title: 'Preventive Care and Screening:' },{ hasVersion: true, number: 'CMS65', title: 'Hypertension: Improvement in bl' },{ hasVersion: true, number: 'CMS66', title: 'Functional status assessment for' },{ hasVersion: true, number: 'CMS68', title: 'Documentation of Current Medicat' },{ hasVersion: true, number: 'CMS69', title: 'Preventive Care and Screening: B' },{ hasVersion: true, number: 'CMS71', title: 'Stroke-3 Ischemic stroke - Antic' },{ hasVersion: true, number: 'CMS72', title: 'Stroke-5 Ischemic stroke - Antit' },{ hasVersion: true, number: 'CMS73', title: 'VTE-3 VTE Patients with Anticoag' },{ hasVersion: true, number: 'CMS74', title: 'Primary Caries Prevention Interv' },{ hasVersion: true, number: 'CMS75', title: 'Children who have dental decay o' },{ hasVersion: true, number: 'CMS77', title: 'HIV/AIDS: RNA control for Patie' },{ hasVersion: true, number: 'CMS82', title: 'Maternal depression screening' },{ hasVersion: true, number: 'CMS90', title: 'Functional status assessment for' },{ hasVersion: true, number: 'CMS91', title: 'Stroke-4 Ischemic stroke - Throm' },{ hasVersion: true, number: 'CMS9V1', title: 'Exclusive Breast Milk Feeding' }]}
    ];

    function fakeDate() {
        return Math.floor(Math.random() * 120 + 1900) + "-" + months[Math.floor(Math.random() * months.length)] + "-" + days[Math.floor(Math.random() * days.length)];
    }

    function fakeWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    function fakeChunk() {
        var chunks = [].concat(words).concat(months).concat(days);
        return chunks[Math.floor(Math.random() * chunks.length)];
    }

    function fakeSentence(maxWords) {
        var wordCount = Math.floor(Math.random() * (maxWords / 2) + (maxWords / 2));
        var ret = "";
        for (var i = 0; i < wordCount; i++) {
            ret += fakeWord() + " ";
        }
        ret += fakeWord() + ".";
        return ret;
    }

    function fakeModifiedItems() {
        var ret = [];
        for (var i = 0; i < 4; i++) {
            ret.push({
                actor: fakeWord() + ' ' + fakeWord(),
                action: fakeSentence(12),
                date: fakeDate()
            });
        }
        return ret;
    }

    var fakeCerts = [];
    function makeFakeCerts() {
        fakeCerts.push(
            {title: '2011 Certifications', certs: []},
            {title: '2014 Certifications', certs: []},
            {title: 'Clinical Quality Measures', certs: []}
        );

        var cert;
        var isActive;
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < allCerts[i].certs.length; j++) {
                cert = allCerts[i].certs[j];
                isActive = [true,false][Math.floor(Math.random() * 2)];
                cert.isActive = isActive;
                fakeCerts[i].certs.push(cert);
            }
        }
        for (var i = 0; i < allCerts[2].certs.length; i++) {
            cert = allCerts[2].certs[i];
            isActive = [true,false][Math.floor(Math.random() * 2)];
            cert.isActive = isActive;
            if (isActive && cert.hasVersion) {
                cert.version = 'v' + Math.floor(Math.random() * 5);
            }
            fakeCerts[2].certs.push(cert);
        }
        return fakeCerts;
    }
    makeFakeCerts();

    function makeFakes(many) {
        for (var cp_id = 0; cp_id < many; cp_id++) {
            var vendor = fakeWord() + " " + fakeWord();
            var product = fakeWord() + " " + fakeWord() + "-" + fakeWord();
            vendorList[vendor] = true;
            productList[product] = true;

            allProducts.push({
                additionalSoftware: fakeSentence(20),
                vendor: vendor,
                product: product,
                version: fakeChunk() + "." + fakeChunk(),
                edition: ['2011', '2014'][Math.floor(Math.random() * 2)],
                certDate: fakeDate(),
                lastModifiedDate: fakeDate(),
                lastModifiedItems: fakeModifiedItems(),
                classification: ['Complete EHR', 'Modular EHR'][Math.floor(Math.random() * 2)],
                practiceType: ['Ambulatory', 'Inpatient'][Math.floor(Math.random() * 2)],
                certBody: certBodies[Math.floor(Math.random() * certBodies.length)],
                certs: fakeCerts,
                chplNum: 'CHP-' + Math.floor(Math.random() * 10000 + 10000),
                id: cp_id
            });
        }
    }

    function getAllProducts() {
        return allProducts;
    }

    function makeProduct() {
        return allProducts[Math.floor(Math.random() * allProducts.length)];
    }

    function listCerts() {
        var ret = [];
        for (var i = 0; i <= 1; i++) {
            ret = ret.concat(allCerts[i].certs);
        }
        return ret;
    }

    function listCQMs() {
        return allCerts[2];
    }

    function listVendors() {
        var ret = [];
        for (var vendor in vendorList) {
            ret.push({type: 'vendor',
                      value: vendor});
        }
        return ret;
    }

    function listProducts() {
        var ret = [];
        for (var product in productList) {
            ret.push({type: 'product',
                      value: product});
        }
        return ret;
    }

    function listCertBodies() {
        var ret = [];
        for (var i = 0; i < certBodies.length; i++) {
            ret.push({value: certBodies[i]});
        }
        return ret;
    }

    function listFilterCerts() {
        return allCerts;
    }

    function listCertifiedProductActivity() {
        var ret = [];
        ret.push({product: 'prod', vendor: 'vend', version: '123', certBody: 'ACB', edition: '2011', activityDate: '2015-02-13', activity: 'added certification'}
                 ,{product: 'dorp', vendor: 'dnev', version: 'bde', certBody: 'ACB2', edition: '2014', activityDate: '2014-02-13', activity: 'certified'});
        return ret;
    };

    function listVendorActivity() {
        var ret = [];
        ret.push({vendor: 'vend', activityDate: '2015-02-13', activity: 'A new vendor was added to the CHPL'}
                 ,{vendor: 'dnev', activityDate: '2014-02-13', activity: 'BigCorp was acquired by SmallCorp Ltd.'});
        return ret;
    };

    function listProductActivity() {
        var ret = [];
        ret.push({vendor: 'vend', product: 'prod1', activityDate: '2015-02-13', activity: '"vend" wants to certify "prod1"'}
                 ,{vendor: 'dnev', product: 'another product', activityDate: '2014-02-13', activity: '"another product" has been purchased by "dnev"'});
        return ret;
    };

    function listAcbActivity() {
        var ret = [];
        ret.push({name: 'acb1', activityDate: '2015-02-13', activity: 'A new user was added'}
                 ,{name: 'acb2', activityDate: '2014-02-13', activity: 'A user was removed from this ACB'});
        return ret;
    };

    makeFakes(totalResults);
    /*
     * End of dummy data section
     *******************************************************/

    angular.module('appDev', ['app', 'ngMockE2E'])
        .run(function ($httpBackend) {
            $httpBackend.whenGET(/^api\/.*/).passThrough();
            $httpBackend.whenGET(/^nav\/.*/).passThrough();
            $httpBackend.whenGET(/^admin\/.*/).passThrough();
            $httpBackend.whenGET(/^search\/.*/).passThrough();
            $httpBackend.whenGET(/^compare\/.*/).passThrough();
            $httpBackend.whenGET(/^common\/.*/).passThrough();
            $httpBackend.whenGET(/^product\/.*/).passThrough();
            $httpBackend.whenGET(/localhost:8080/).passThrough();
            $httpBackend.whenPOST(/localhost:8080/).passThrough();
            $httpBackend.whenGET(/ainq.com\/list_api_calls/).respond(200, apis.endpoints); // fake search results
            $httpBackend.whenGET(/ainq.com\/list_api_entities/).respond(200, apis.entities); // fake search results
            $httpBackend.whenGET(/ainq.com\/search/).respond(200, getAllProducts()); // fake search results
            $httpBackend.whenGET(/ainq.com\/get_product/).respond(200, makeProduct()); // fake product
            $httpBackend.whenGET(/ainq.com\/list_certs/).respond(200, listCerts()); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_cqms/).respond(200, listCQMs()); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_editions/).respond(200, [{value: '2011'}, {value: '2014'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_classifications/).respond(200, [{value: 'Complete EHR'}, {value: 'Modular EHR'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_practices/).respond(200, [{value: 'Inpatient'}, {value: 'Ambulatory'}]); // fake all certs
            $httpBackend.whenGET(/ainq.com\/list_products/).respond(200, listProducts()); // list all products
            $httpBackend.whenGET(/ainq.com\/list_vendors/).respond(200, listVendors()); // list all vendors
            $httpBackend.whenGET(/ainq.com\/list_certBodies/).respond(200, listCertBodies()); // list cerification bodies
            $httpBackend.whenGET(/ainq.com\/list_filterCerts/).respond(200, listFilterCerts()); // list cerification bodies
            $httpBackend.whenGET(/ainq.com\/list_certifiedProductActivity/).respond(200, listCertifiedProductActivity()); // list certifiedProduct activities
            $httpBackend.whenGET(/ainq.com\/list_vendorActivity/).respond(200, listVendorActivity()); // list vendor activities
            $httpBackend.whenGET(/ainq.com\/list_productActivity/).respond(200, listProductActivity()); // list product activities
            $httpBackend.whenGET(/ainq.com\/list_acbActivity/).respond(200, listAcbActivity()); // list product activities
            $httpBackend.whenGET(/ainq.com\/list_uploadingCps/).respond(200, [{vendor: {name: 'Vend', lastModifiedDate: '2013-03-02'}, product: {name: 'Prod', lastModifiedDate: '2014-05-02'},
                                                                               version: {name: '1.2.3'}, edition: '2014', uploadDate: '2015-07-02'}]); // list fake uploadingCps
        })
        .config(function ($provide) {
            $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    //alert(exception.message);
                };
            }])
        })
/*        .config(function($provide) { // fake a delay
            $provide.decorator('$httpBackend', function($delegate) {
                var proxy = function(method, url, data, callback, headers) {
                    var interceptor = function() {
                        var _this = this,
                            _arguments = arguments;
                        setTimeout(function() {
                            callback.apply(_this, _arguments);
                        }, 100); // delay for .1s
                    };
                    return $delegate.call(this, method, url, data, interceptor, headers);
                };
                for(var key in $delegate) {
                    proxy[key] = $delegate[key];
                }
                return proxy;
            });
        });
*/})();
