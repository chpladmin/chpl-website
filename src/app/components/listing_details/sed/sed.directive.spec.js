(function () {
    'use strict';

    describe('the SED Display', function () {
        var $compile, $log, $uibModal, Mock, actualOptions, el, mock, scope, utilService, vm;

        /* eslint-disable quotes, key-spacing */
        mock = {sed: {"ucdProcesses": [{"id": 6,"name": "NISTIR 7741","details": "NISTIR 7741 was used","criteria": [{"id": null,"number": "170.315 (a)(14)","title": "Implantable Device List","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(1)","title": "Computerized Provider Order Entry (CPOE) - Medications","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(6)","title": "Problem List","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (b)(3)","title": "Electronic Prescribing","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(9)","title": "Clinical Decision Support","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(7)","title": "Medication List","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(2)","title": "CPOE - Laboratory","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(4)","title": "Drug-Drug, Drug-Allergy Interaction Checks for CPOE","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(3)","title": "CPOE - Diagnostic Imaging","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(5)","title": "Demographics","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(8)","title": "Medication Allergy List","certificationEditionId": null,"certificationEdition": null,"description": null}]}],"testTasks": [{"id": 1183,"uniqueId": null,"description": "Task for (b)(2)","taskSuccessAverage": 77.88,"taskSuccessStddev": 9,"taskPathDeviationObserved": 13,"taskPathDeviationOptimal": 8,"taskTimeAvg": 142,"taskTimeStddev": 14,"taskTimeDeviationObservedAvg": 12,"taskTimeDeviationOptimalAvg": 8,"taskErrors": 15,"taskErrorsStddev": 4,"taskRatingScale": "Likert","taskRating": 4.5,"taskRatingStddev": 5,"criteria": [{"id": null,"number": "170.315 (b)(3)","title": "Electronic Prescribing","certificationEditionId": null,"certificationEdition": null,"description": null}],"testParticipants": [{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2265,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 7,"ageRange": "60-69","occupation": "Triage Coordinator","professionalExperienceMonths": 160,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2263,"uniqueId": null,"gender": "Female","educationTypeId": 2,"educationTypeName": "High school graduate, diploma or the equivalent (for example: GED)","ageRangeId": 6,"ageRange": "50-59","occupation": "Clinical Assistant","professionalExperienceMonths": 87,"computerExperienceMonths": 210,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2269,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 130,"computerExperienceMonths": 220,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"}]},{"id": 1184,"uniqueId": null,"description": "Task for (a)(5)","taskSuccessAverage": 66.12,"taskSuccessStddev": 8,"taskPathDeviationObserved": 7,"taskPathDeviationOptimal": 4,"taskTimeAvg": 133,"taskTimeStddev": 12,"taskTimeDeviationObservedAvg": 13,"taskTimeDeviationOptimalAvg": 9,"taskErrors": 12,"taskErrorsStddev": 3,"taskRatingScale": "System Usability Scale","taskRating": 86,"taskRatingStddev": 3,"criteria": [{"id": null,"number": "170.315 (a)(14)","title": "Implantable Device List","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(6)","title": "Problem List","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(9)","title": "Clinical Decision Support","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(7)","title": "Medication List","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(5)","title": "Demographics","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(8)","title": "Medication Allergy List","certificationEditionId": null,"certificationEdition": null,"description": null}],"testParticipants": [{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"}]},{"id": 1185,"uniqueId": null,"description": "Task for (a)(2)","taskSuccessAverage": 44.32,"taskSuccessStddev": 6,"taskPathDeviationObserved": 7,"taskPathDeviationOptimal": 5,"taskTimeAvg": 80,"taskTimeStddev": 10,"taskTimeDeviationObservedAvg": 16,"taskTimeDeviationOptimalAvg": 14,"taskErrors": 17,"taskErrorsStddev": 3,"taskRatingScale": "System Usability Scale","taskRating": 88,"taskRatingStddev": 1,"criteria": [{"id": null,"number": "170.315 (a)(2)","title": "CPOE - Laboratory","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(4)","title": "Drug-Drug, Drug-Allergy Interaction Checks for CPOE","certificationEditionId": null,"certificationEdition": null,"description": null},{"id": null,"number": "170.315 (a)(3)","title": "CPOE - Diagnostic Imaging","certificationEditionId": null,"certificationEdition": null,"description": null}],"testParticipants": [{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2269,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 130,"computerExperienceMonths": 220,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2263,"uniqueId": null,"gender": "Female","educationTypeId": 2,"educationTypeName": "High school graduate, diploma or the equivalent (for example: GED)","ageRangeId": 6,"ageRange": "50-59","occupation": "Clinical Assistant","professionalExperienceMonths": 87,"computerExperienceMonths": 210,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2273,"uniqueId": null,"gender": "Male","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 51,"computerExperienceMonths": 251,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2269,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 130,"computerExperienceMonths": 220,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2273,"uniqueId": null,"gender": "Male","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 51,"computerExperienceMonths": 251,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2263,"uniqueId": null,"gender": "Female","educationTypeId": 2,"educationTypeName": "High school graduate, diploma or the equivalent (for example: GED)","ageRangeId": 6,"ageRange": "50-59","occupation": "Clinical Assistant","professionalExperienceMonths": 87,"computerExperienceMonths": 210,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2263,"uniqueId": null,"gender": "Female","educationTypeId": 2,"educationTypeName": "High school graduate, diploma or the equivalent (for example: GED)","ageRangeId": 6,"ageRange": "50-59","occupation": "Clinical Assistant","professionalExperienceMonths": 87,"computerExperienceMonths": 210,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2269,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 130,"computerExperienceMonths": 220,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2273,"uniqueId": null,"gender": "Male","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 51,"computerExperienceMonths": 251,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"}]},{"id": 1186,"uniqueId": null,"description": "Order specific medication and then change the order based on the information provided.","taskSuccessAverage": 88.56,"taskSuccessStddev": 8,"taskPathDeviationObserved": 10,"taskPathDeviationOptimal": 8,"taskTimeAvg": 120,"taskTimeStddev": 10,"taskTimeDeviationObservedAvg": 17,"taskTimeDeviationOptimalAvg": 8,"taskErrors": 19,"taskErrorsStddev": 2,"taskRatingScale": "System Usability Scale","taskRating": 80,"taskRatingStddev": 1,"criteria": [{"id": null,"number": "170.315 (a)(1)","title": "Computerized Provider Order Entry (CPOE) - Medications","certificationEditionId": null,"certificationEdition": null,"description": null}],"testParticipants": [{"id": 2267,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 200,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2274,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 250,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2272,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 130,"computerExperienceMonths": 240,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2269,"uniqueId": null,"gender": "Female","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 6,"ageRange": "50-59","occupation": "MD","professionalExperienceMonths": 130,"computerExperienceMonths": 220,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2263,"uniqueId": null,"gender": "Female","educationTypeId": 2,"educationTypeName": "High school graduate, diploma or the equivalent (for example: GED)","ageRangeId": 6,"ageRange": "50-59","occupation": "Clinical Assistant","professionalExperienceMonths": 87,"computerExperienceMonths": 210,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2260,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "No"},{"id": 2273,"uniqueId": null,"gender": "Male","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 51,"computerExperienceMonths": 251,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2268,"uniqueId": null,"gender": "Male","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Physician's Assistant","professionalExperienceMonths": 77,"computerExperienceMonths": 230,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2266,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 5,"ageRange": "40-49","occupation": "RN","professionalExperienceMonths": 160,"computerExperienceMonths": 200,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2265,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 7,"ageRange": "60-69","occupation": "Triage Coordinator","professionalExperienceMonths": 160,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2264,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "Clinical Assistant","professionalExperienceMonths": 80,"computerExperienceMonths": 240,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2261,"uniqueId": null,"gender": "Male","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 4,"ageRange": "30-39","occupation": "RN","professionalExperienceMonths": 140,"computerExperienceMonths": 210,"productExperienceMonths": 14,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2274,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 3,"ageRange": "20-29","occupation": "RN","professionalExperienceMonths": 150,"computerExperienceMonths": 250,"productExperienceMonths": 13,"assistiveTechnologyNeeds": "No"},{"id": 2270,"uniqueId": null,"gender": "Male","educationTypeId": 9,"educationTypeName": "Doctorate degree (e.g., MD, DNP, DMD, PhD)","ageRangeId": 5,"ageRange": "40-49","occupation": "MD","professionalExperienceMonths": 120,"computerExperienceMonths": 240,"productExperienceMonths": 12,"assistiveTechnologyNeeds": "Yes, used VoiceOver"},{"id": 2265,"uniqueId": null,"gender": "Female","educationTypeId": 5,"educationTypeName": "Associate degree","ageRangeId": 7,"ageRange": "60-69","occupation": "Triage Coordinator","professionalExperienceMonths": 160,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "No"},{"id": 2271,"uniqueId": null,"gender": "Female","educationTypeId": 6,"educationTypeName": "Bachelor's degree","ageRangeId": 4,"ageRange": "30-39","occupation": "Clinical Assistant","professionalExperienceMonths": 50,"computerExperienceMonths": 250,"productExperienceMonths": 15,"assistiveTechnologyNeeds": "No"},{"id": 2262,"uniqueId": null,"gender": "Female","educationTypeId": 7,"educationTypeName": "Master's degree","ageRangeId": 5,"ageRange": "40-49","occupation": "Physician's Assistant","professionalExperienceMonths": 60,"computerExperienceMonths": 220,"productExperienceMonths": 16,"assistiveTechnologyNeeds": "Yes, used VoiceOver"}]}]}};
        /* eslint-enable quotes, key-spacing */

        beforeEach(function () {
            module('chpl.templates', 'chpl.mock', 'chpl', function ($provide) {
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.makeCsv = jasmine.createSpy('makeCsv');
                    $delegate.sortCertArray = jasmine.createSpy('sortCertArray');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, $rootScope, _$uibModal_, _Mock_, _utilService_) {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;
                utilService = _utilService_;
                utilService.makeCsv.and.returnValue();
                utilService.sortCertArray.and.callThrough();
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                el = angular.element('<ai-sed listing="listing"></ai-sed>');

                scope = $rootScope.$new();
                scope.listing = Mock.fullListings[1];
                scope.listing.sed = angular.copy(mock.sed);
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                scope.vm = vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
                expect(vm.listing).toBeDefined();
            });

            describe('should use the util service', function () {
                it('to enable sorting of tasks', function () {
                    vm.sortTasks(vm.tasks[0]);
                    expect(utilService.sortCertArray).toHaveBeenCalledWith(['170.315 (a)(1)', '170.315 (a)(2)', '170.315 (a)(3)', '170.315 (a)(4)', '170.315 (a)(5)', '170.315 (a)(6)', '170.315 (a)(7)', '170.315 (a)(8)', '170.315 (a)(9)', '170.315 (a)(14)', '170.315 (b)(3)']);
                });

                it('to enable sorting of processes', function () {
                    vm.sortProcesses(vm.tasks[0]);
                    expect(utilService.sortCertArray).toHaveBeenCalledWith(['170.315 (a)(1)', '170.315 (a)(2)', '170.315 (a)(3)', '170.315 (a)(4)', '170.315 (a)(5)', '170.315 (a)(6)', '170.315 (a)(7)', '170.315 (a)(8)', '170.315 (a)(9)', '170.315 (a)(14)', '170.315 (b)(3)']);
                });

                it('to make a csv', function () {
                    vm.getCsv();
                    expect(utilService.makeCsv).toHaveBeenCalled();
                });
            });

            describe('during initialization', function () {
                it('should know how many criteria were sed tested', function () {
                    expect(vm.criteriaCount).toBeDefined();
                    expect(vm.criteriaCount).toBe(12);
                });

                it('should filter out criteria that were not successful or not sed', function () {
                    expect(vm.sedCriteria.length).toBe(12);
                });

                describe('with respect to tasks', function () {
                    it('should have an array of tasks', function () {
                        expect(vm.tasks.length).toBe(4);
                    });

                    it('should have the associated criteria attached to the tasks', function () {
                        expect(vm.tasks[0].criteria[0].number).toEqual('170.315 (b)(3)');
                    });

                    it('should know what the task length is', function () {
                        expect(vm.taskCount).toBeDefined();
                        expect(vm.taskCount).toBe(4);
                    });
                });

                describe('with respect to participants', function () {
                    it('should have an array of unique participants pulled from the tasks', function () {
                        expect(vm.allParticipants.length).toBe(15);
                    });

                    it('should have an array of taskIds associated with each participant', function () {
                        expect(vm.allParticipants[0].tasks).toEqual([1183, 1184, 1184, 1184, 1184, 1184, 1184, 1186, 1186]);
                    });
                });

                describe('with respect to ucd processes', function () {
                    it('should have an array of ucd processes that were used', function () {
                        expect(vm.ucdProcesses.length).toBe(2);
                    });

                    it('should associate the UCD Processes with multiple criteria', function () {
                        expect(vm.ucdProcesses[0].criteria[0].number).toBe('170.315 (a)(1)');
                        expect(vm.ucdProcesses[0].criteria.length).toBe(11);
                    });

                    it('should associate criteria with no UCD process with a "None" process', function () {
                        expect(vm.ucdProcesses[1].name).toBeUndefined();
                        expect(vm.ucdProcesses[1].details).toBeUndefined();
                        expect(vm.ucdProcesses[1].criteria[0].number).toBe('170.315 (b)(2)');
                        expect(vm.ucdProcesses[1].criteria.length).toBe(1);
                    });
                });

                describe('for the csv download', function () {
                    it('should create a data object with a name and a header row', function () {
                        expect(vm.csvData.name).toBe('15.04.04.2891.Alls.17.1.1.170512.sed.csv');
                        expect(vm.csvData.values[0]).toEqual([
                            'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
                            'Task Description', 'Rating Scale', 'Task Rating', 'Task Rating - Standard Deviation', 'Task Time Mean (s)', 'Task Time - Standard Deviation (s)', 'Task Time Deviation - Observed (s)', 'Task Time Deviation - Optimal (s)', 'Task Success - Mean (%)', 'Task Success - Standard Deviation (%)', 'Task Errors - Mean (%)', 'Task Errors - Standard Deviation (%)', 'Task Path Deviation - Observed (# of Steps)', 'Task Path Deviation - Optimal (# of Steps)',
                            'Occupation', 'Education Type', 'Product Experience (Months)', 'Professional Experience (Months)', 'Computer Experience (Months)', 'Age (Years)', 'Gender', 'Assistive Technology Needs',
                        ]);
                    });

                    it('should have data rows', function () {
                        expect(vm.csvData.values.length).toBe(127);
                        expect(vm.csvData.values[1]).toEqual([
                            '15.04.04.2891.Alls.17.1.1.170512', 'Allscripts', 'Allscripts TouchWorks EHR', '17.1 GA', '170.315 (a)(1)',
                            'Order specific medication and then change the order based on the information provided.', 'System Usability Scale', 80, 1, 120, 10, 17, 8, 88.56, 8, 19, 2, 10, 8,
                            'MD', 'Doctorate degree (e.g., MD, DNP, DMD, PhD)', 15, 200, 250, '50-59', 'Female', 'No',
                        ]);
                    });

                    it('should sort the rows by criteria', function () {
                        expect(vm.csvData.values[1][4]).toBe('170.315 (a)(1)');
                    });

                    it('should combine criteria under the same task', function () {
                        expect(vm.csvData.values[126]).toEqual([
                            '15.04.04.2891.Alls.17.1.1.170512', 'Allscripts', 'Allscripts TouchWorks EHR', '17.1 GA', '170.315 (a)(5);170.315 (a)(6);170.315 (a)(7);170.315 (a)(8);170.315 (a)(9);170.315 (a)(14)',
                            'Task for (a)(5)', 'System Usability Scale', 86, 3, 133, 12, 13, 9, 66.12, 8, 12, 3, 7, 4,
                            'RN', 'Associate degree', 14, 140, 210, '30-39', 'Male', 'Yes, used VoiceOver',
                        ]);
                    });
                });
            });

            describe('while dealing with pending listings', function () {
                beforeEach(function () {
                    var sed = angular.copy(mock.sed);
                    sed.testTasks = sed.testTasks.map(function (task) {
                        task.uniqueId = task.id;
                        delete task.id;
                        task.testParticipants = task.testParticipants.map(function (part) {
                            part.uniqueId = 'id-' + part.id;
                            delete part.id;
                            return part;
                        });
                        return task;
                    });
                    el = angular.element('<ai-sed listing="listing"></ai-sed>');
                    scope.listing = Mock.pendingListings[0];
                    scope.listing.sed = sed;
                    $compile(el)(scope);
                    scope.$digest();
                    vm = el.isolateScope().vm;
                    scope.vm = vm;
                });

                describe('during initialization', function () {
                    it('should know how many criteria were sed tested', function () {
                        expect(vm.criteriaCount).toBe(11);
                    });

                    it('should filter out criteria that were not successful or not sed', function () {
                        expect(vm.sedCriteria.length).toBe(11);
                    });

                    describe('with respect to tasks', function () {
                        it('should have an array of tasks pulled from the criteria', function () {
                            expect(vm.tasks.length).toBe(4);
                        });

                        it('should have the associated criteria attached to the tasks', function () {
                            expect(vm.tasks[0].criteria[0].number).toEqual('170.315 (b)(3)');
                        });

                        it('should know what the task length is', function () {
                            expect(vm.taskCount).toBeDefined();
                            expect(vm.taskCount).toBe(4);
                        });
                    });

                    describe('with respect to participants', function () {
                        it('should have an array of unique participants pulled from the criteria', function () {
                            expect(vm.allParticipants.length).toBe(15);
                        });

                        it('should have an array of taskIds associated with each participant', function () {
                            expect(vm.allParticipants[0].tasks).toEqual([-1, -2, -2, -2, -2, -2, -2, -3, -3, -3, -4]);
                        });

                        it('should set the "id" to be a negative integer', function () {
                            expect(vm.allParticipants[0].id).toBeLessThan(0);
                        });
                    });

                    describe('with respect to ucd processes', function () {
                        it('should have an array of ucd processes that were used', function () {
                            expect(vm.ucdProcesses.length).toBe(1);
                        });

                        it('should associate the UCD Processes with multiple criteria', function () {
                            expect(vm.ucdProcesses[0].criteria[0].number).toEqual('170.315 (a)(1)');
                        });
                    });

                    describe('for the csv download', function () {
                        it('should create a data object with a name and a header row', function () {
                            expect(vm.csvData.name).toBe('15.07.07.1447.EI97.62.01.1.160402.sed.csv');
                            expect(vm.csvData.values[0]).toEqual([
                                'Unique CHPL ID', 'Developer', 'Product', 'Version', 'Certification Criteria',
                                'Task Description', 'Rating Scale', 'Task Rating', 'Task Rating - Standard Deviation', 'Task Time Mean (s)', 'Task Time - Standard Deviation (s)', 'Task Time Deviation - Observed (s)', 'Task Time Deviation - Optimal (s)', 'Task Success - Mean (%)', 'Task Success - Standard Deviation (%)', 'Task Errors - Mean (%)', 'Task Errors - Standard Deviation (%)', 'Task Path Deviation - Observed (# of Steps)', 'Task Path Deviation - Optimal (# of Steps)',
                                'Occupation', 'Education Type', 'Product Experience (Months)', 'Professional Experience (Months)', 'Computer Experience (Months)', 'Age (Years)', 'Gender', 'Assistive Technology Needs',
                            ]);
                        });

                        it('should have data rows', function () {
                            expect(vm.csvData.values.length).toBe(127);
                            expect(vm.csvData.values[1]).toEqual([
                                '15.07.07.1447.EI97.62.01.1.160402', 'Epic Systems Corporation', 'EpicCare Inpatient - Core EMR', 'testV2', '170.315 (a)(1)',
                                'Order specific medication and then change the order based on the information provided.', 'System Usability Scale', 80, 1, 120, 10, 17, 8, 88.56, 8, 19, 2, 10, 8,
                                'MD', 'Doctorate degree (e.g., MD, DNP, DMD, PhD)', 15, 200, 250, '50-59', 'Female', 'No',
                            ]);
                        });

                        it('should sort the rows by criteria', function () {
                            expect(vm.csvData.values[1][4]).toBe('170.315 (a)(1)');
                        });

                        it('should combine criteria under the same task', function () {
                            expect(vm.csvData.values[126]).toEqual([
                                '15.07.07.1447.EI97.62.01.1.160402', 'Epic Systems Corporation', 'EpicCare Inpatient - Core EMR', 'testV2', '170.315 (a)(5);170.315 (a)(6);170.315 (a)(7);170.315 (a)(8);170.315 (a)(9);170.315 (a)(14)',
                                'Task for (a)(5)', 'System Usability Scale', 86, 3, 133, 12, 13, 9, 66.12, 8, 12, 3, 7, 4,
                                'RN', 'Associate degree', 14, 140, 210, '30-39', 'Male', 'Yes, used VoiceOver',
                            ]);
                        });
                    });
                });
            });
        });

        describe('when viewing Task details', function () {
            var modalOptions, participants, task;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listing_details/sed/taskModal.html',
                    controller: 'ViewSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        criteria: jasmine.any(Function),
                        editMode: jasmine.any(Function),
                        participants: jasmine.any(Function),
                        task: jasmine.any(Function),
                    },
                };
                task = {
                    id: 3,
                };
                participants = [1,2,3];
                vm.allParticipants = participants;
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewTask(task);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.editMode = 'on';
                vm.viewTask(task);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.criteria()[0].number).toEqual('170.315 (b)(2)');
                expect(actualOptions.resolve.editMode()).toBe('on');
                expect(actualOptions.resolve.participants()).toEqual(participants);
                expect(actualOptions.resolve.task()).toEqual(task);
            });

            it('should replace the active task with an edited one on close', function () {
                var newTask = {
                    name: 'fake',
                    id: vm.tasks[1].id,
                };
                vm.viewTask(vm.tasks[1]);
                vm.modalInstance.close({
                    task: newTask,
                    participants: [1],
                });
                expect(vm.tasks[1]).toBe(newTask);
                expect(vm.allParticipants).toEqual([1]);
            });

            it('should remove the active task if it was deleted', function () {
                var initLength = vm.tasks.length;
                vm.viewTask(vm.tasks[1]);
                vm.modalInstance.close({
                    deleted: true,
                    participants: [1],
                });
                expect(vm.tasks.length).toBe(initLength - 1);
                expect(vm.allParticipants).toEqual([1]);
            });
        });

        describe('when adding a Task', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/sed/editTask.html',
                    controller: 'EditSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        criteria: jasmine.any(Function),
                        participants: jasmine.any(Function),
                        task: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.addTask();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.allParticipants = [1,2];
                vm.addTask();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.criteria()[0].number).toEqual('170.315 (b)(2)');
                expect(actualOptions.resolve.participants()).toEqual([1,2]);
                expect(actualOptions.resolve.task()).toEqual({});
            });

            it('should add the new task to the list of tasks', function () {
                vm.tasks = [];
                vm.addTask();
                vm.modalInstance.close({task: 'new', participants: [2,3]});
                expect(vm.tasks).toEqual(['new']);
            });

            it('should update the list of participants', function () {
                vm.allParticipants = [1,2];
                vm.addTask();
                vm.modalInstance.close({task: 'new', participants: [2,3]});
                expect(vm.allParticipants).toEqual([2,3]);
            });
        });

        describe('when viewing Task Participants', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listing_details/sed/participantsModal.html',
                    controller: 'ViewSedParticipantsController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        allParticipants: jasmine.any(Function),
                        editMode: jasmine.any(Function),
                        participants: jasmine.any(Function),
                    },
                };
                vm.tasks = [
                    {
                        id: 1,
                        testParticipants: [1,2],
                    },
                    {
                        id: 2,
                        testParticipants: [3,4],
                    },
                ];
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewParticipants(vm.tasks[1]);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.allParticipants = [1,2];
                vm.editMode = 'on';
                vm.viewParticipants(vm.tasks[1]);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.allParticipants()).toEqual([1,2]);
                expect(actualOptions.resolve.editMode()).toBe('on');
                expect(actualOptions.resolve.participants()).toEqual([3,4]);
            });

            it('should replace the task participant list with an edited one on close', function () {
                var newParticipants = [1,2,3];
                vm.viewParticipants(vm.tasks[1]);
                vm.modalInstance.close({
                    participants: newParticipants,
                });
                expect(vm.tasks[1].testParticipants).toEqual(newParticipants);
            });

            it('should replace the "all participants" list with an edited one on close', function () {
                var newParticipants = [1,2,3];
                vm.allParticipants = [1,2];
                vm.viewParticipants(vm.tasks[1]);
                vm.modalInstance.close({
                    allParticipants: newParticipants,
                });
                expect(vm.allParticipants).toEqual(newParticipants);
            });
        });

        describe('when editing SED details', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/sed/editDetails.html',
                    controller: 'EditSedDetailsController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        criteria: jasmine.any(Function),
                        listing: jasmine.any(Function),
                        resources: jasmine.any(Function),
                        ucdProcesses: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editDetails();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.resources = 'resources';
                vm.editDetails();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.criteria()).toEqual(vm.sedCriteria);
                expect(actualOptions.resolve.listing()).toEqual(vm.listing);
                expect(actualOptions.resolve.resources()).toBe('resources');
                expect(actualOptions.resolve.ucdProcesses()).toEqual(vm.ucdProcesses);
            });

            it('should update some of the active listing values with the edited values on close', function () {
                var newListing = {
                    sedReportFileLocation: 'new',
                    sedIntendedUserDescription: 'desc',
                    sedTestingEndDate: 'a date',
                };
                expect(vm.listing.sedReportFileLocation).not.toEqual(newListing.sedReportFileLocation);
                expect(vm.listing.sedIntendedUserDescription).not.toEqual(newListing.sedIntendedUserDescription);
                expect(vm.listing.sedTestingEndDate).not.toEqual(newListing.sedTestingEndDate);

                vm.editDetails();
                vm.modalInstance.close({
                    listing: newListing,
                });

                expect(vm.listing.sedReportFileLocation).toEqual(newListing.sedReportFileLocation);
                expect(vm.listing.sedIntendedUserDescription).toEqual(newListing.sedIntendedUserDescription);
                expect(vm.listing.sedTestingEndDate).toEqual(newListing.sedTestingEndDate);
            });

            it('should replace ucd processes with the new ones', function () {
                var newProcesses = [1,2];
                vm.editDetails();
                vm.modalInstance.close({
                    listing: {sed: {}},
                    ucdProcesses: newProcesses,
                });
                expect(vm.ucdProcesses).toEqual(newProcesses);
            });
        });
    });
})();
