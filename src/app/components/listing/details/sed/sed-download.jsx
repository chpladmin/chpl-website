import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { ExportToCsv } from 'export-to-csv';

import { listing as listingPropType } from 'shared/prop-types';
import { eventTrack } from 'services/analytics.service';
import { sortCriteria } from 'services/criteria.service';
import { UserContext } from 'shared/contexts';

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
  { headerName: 'Education Type', objectKey: 'educationType' },
  { headerName: 'Product Experience (Months)', objectKey: 'productExperienceMonths' },
  { headerName: 'Professional Experience (Months)', objectKey: 'professionalExperienceMonths' },
  { headerName: 'Computer Experience (Months)', objectKey: 'computerExperienceMonths' },
  { headerName: 'Age (Years)', objectKey: 'age' },
  { headerName: 'Gender', objectKey: 'gender' },
  { headerName: 'Assistive Technology Needs', objectKey: 'assistiveTechnologyNeeds' },
];

const csvOptions = {
  headers,
  showLabels: true,
};

function ChplSedDownload({ listing }) {
  const [rows, setRows] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const base = {
      chplProductNumber: listing.chplProductNumber,
      developer: listing.developer.name,
      product: listing.product.name,
      version: listing.version.version,
    };
    setRows(listing.sed.testTasks
      .flatMap((task) => task.testParticipants
        .map((participant) => ({
          ...base,
          ...task,
          criteria: task.criteria.sort(sortCriteria).map((crit) => `${crit.removed ? 'Removed | ' : ''}${crit.number}`).join(';'),
          ...{
            ...participant,
            age: participant.age.name,
            educationType: participant.educationType.name,
          },
        })))
      .sort((a, b) => {
        if (a.description !== b.description) { return a.description < b.description ? -1 : 1; }
        if (a.occupation !== b.occupation) { return a.occupation < b.occupation ? -1 : 1; }
        if (a.educationType.name !== b.educationType.name) { return a.educationType.name < b.educationType.name ? -1 : 1; }
        if (a.productExperienceMonths !== b.productExperienceMonths) { return a.productExperienceMonths - b.productExperienceMonths; }
        if (a.professionalExperienceMonths !== b.professionalExperienceMonths) { return a.professionalExperienceMonths - b.professionalExperienceMonths; }
        if (a.computerExperienceMonths !== b.computerExperienceMonths) { return a.computerExperienceMonths - b.computerExperienceMonths; }
        return 0;
      }));
  }, [listing]);

  const handleDownload = () => {
    eventTrack({
      event: 'Download Task Details',
      category: 'Listing Details',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
      group: user?.role,
    });
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
        endIcon={<CloudDownloadIcon />}
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
