import React, { useEffect, useState } from 'react';
import {
  Button,
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { ExportToCsv } from 'export-to-csv';

import { listing as listingPropType } from 'shared/prop-types';
import { getAngularService } from 'services/angular-react-helper';
import { sortCriteria } from 'services/criteria.service';

const headers = [
  { headerName: 'Unique CHPL ID', objectKey: 'chplProductNumber' },
  { headerName: 'Developer', objectKey: 'developer' },
  { headerName: 'Product', objectKey: 'product' },
  { headerName: 'Version', objectKey: 'version' },
  { headerName: 'Certification Criteria', objectKey: 'criteria' },
  { headerName: 'Task Description', objectKey: 'description' },
  { headerName: 'Rating Scale', objectKey: 'taskRatingScale' },
  { headerName: 'Task Rating', objectKey: 'taskRating' },
  { headerName: 'Task Rating - Standard Deviation', objectKey: 'taskRatingStddev' },
  { headerName: 'Task Time Mean (s)', objectKey: 'taskTimeAvg' },
  { headerName: 'Task Time - Standard Deviation (s)', objectKey: 'taskTimeStddev' },
  { headerName: 'Task Time Deviation - Observed (s)', objectKey: 'taskTimeDeviationObservedAvg' },
  { headerName: 'Task Time Deviation - Optimal (s)', objectKey: 'taskTimeDeviationOptimalAvg' },
  { headerName: 'Task Success - Mean (%)', objectKey: 'taskSuccessAverage' },
  { headerName: 'Task Success - Standard Deviation (%)', objectKey: 'taskSuccessStddev' },
  { headerName: 'Task Errors - Mean (%)', objectKey: 'taskErrors' },
  { headerName: 'Task Errors - Standard Deviation (%)', objectKey: 'taskErrorsStddev' },
  { headerName: 'Task Path Deviation - Observed (# of Steps)', objectKey: 'taskPathDeviationObserved' },
  { headerName: 'Task Path Deviation - Optimal (# of Steps)', objectKey: 'taskPathDeviationOptimal' },
  { headerName: 'Occupation', objectKey: 'occupation' },
  { headerName: 'Education Type', objectKey: 'educationTypeName' },
  { headerName: 'Product Experience (Months)', objectKey: 'productExperienceMonths' },
  { headerName: 'Professional Experience (Months)', objectKey: 'professionalExperienceMonths' },
  { headerName: 'Computer Experience (Months)', objectKey: 'computerExperienceMonths' },
  { headerName: 'Age (Years)', objectKey: 'ageRange' },
  { headerName: 'Gender', objectKey: 'gender' },
  { headerName: 'Assistive Technology Needs', objectKey: 'assistiveTechnologyNeeds' },
];

const csvOptions = {
  headers,
  showLabels: true,
};

function ChplSedDownload({ listing }) {
  const $analytics = getAngularService('$analytics');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const base = {
      chplProductNumber: listing.chplProductNumber,
      developer: listing.developer.name,
      product: listing.product.name,
      version: listing.version.version,
    };
    setRows(listing.sed.testTasks
      .flatMap((task) => task.testParticipants.map((participant) => ({
        ...base,
        ...task,
        criteria: task.criteria.sort(sortCriteria).map((crit) => `${crit.removed ? 'Removed | ' : ''}${crit.number}`).join(';'),
        ...participant,
      })))
      .sort((a, b) => {
        if (a.description !== b.description) { return a.description < b.description ? -1 : 1; }
        if (a.occupation !== b.occupation) { return a.occupation < b.occupation ? -1 : 1; }
        if (a.educationTypeName !== b.educationTypeName) { return a.educationTypeName < b.educationTypeName ? -1 : 1; }
        if (a.productExperienceMonths !== b.productExperienceMonths) { return a.productExperienceMonths - b.productExperienceMonths; }
        if (a.professionalExperienceMonths !== b.professionalExperienceMonths) { return a.professionalExperienceMonths - b.professionalExperienceMonths; }
        if (a.computerExperienceMonths !== b.computerExperienceMonths) { return a.computerExperienceMonths - b.computerExperienceMonths; }
        return 0;
      }));
  }, [listing]);

  const handleDownload = () => {
    $analytics.eventTrack('Download SED Details', { category: 'Listing Details', lable: listing.chplProductNumber });
    const csvExporter = new ExportToCsv({
      ...csvOptions,
      filename: `${listing.chplProductNumber}.sed`,
    });
    csvExporter.generateCsv(rows);
  };

  return (
    <>
      <Button
        onClick={handleDownload}
        color="secondary"
        variant="contained"
        size="small"
        id="download-task-details"
        endIcon={<ArrowDownwardIcon />}
      >
        Download Task Details
      </Button>
    </>
  );
}

export default ChplSedDownload;

ChplSedDownload.propTypes = {
  listing: listingPropType.isRequired,
};
