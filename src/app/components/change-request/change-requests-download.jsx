import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { arrayOf, func } from 'prop-types';
import { ExportToCsv } from 'export-to-csv';

import { changeRequest as changeRequestProp } from 'shared/prop-types';

const CUSTOM_FIELD_COUNT = 7;
const csvOptions = {
  showLabels: true,
  headers: [
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Request Type', objectKey: 'changeRequestTypeName' },
    { headerName: 'Creation Date', objectKey: 'friendlyReceivedDate' },
    { headerName: 'Request Status', objectKey: 'currentStatusName' },
    { headerName: 'Last Status Change', objectKey: 'friendlyCurrentStatusChangeDate' },
    { headerName: 'Relevant ONC-ACBs', objectKey: 'relevantAcbs' },
    ...Array(CUSTOM_FIELD_COUNT)
      .fill('Custom Field')
      .map((val, idx) => ({
        headerName: `${val} ${idx + 1}`,
        objectKey: `field${idx + 1}`,
      })),
  ],
};

const useStyles = makeStyles({
  closeIcon: {
    marginTop: '8px',
  },
});

function ChplChangeRequestsDownload(props) {
  const {
    dispatch,
    changeRequests,
  } = props;
  const csvExporter = new ExportToCsv(csvOptions);
  const classes = useStyles();

  const download = () => {
    csvExporter.generateCsv(changeRequests);
  };

  return (
    <Card>
      <CardHeader
        title="Download Change Requests"
        action={(
          <IconButton
            variant="contained"
            color="primary"
            onClick={() => dispatch('closeDownload')}
            className={classes.closeIcon}
          >
            <CloseIcon />
          </IconButton>
)}
      />
      <CardContent>
        <Button
          onClick={download}
        >
          Download
        </Button>
      </CardContent>
    </Card>
  );
}

export default ChplChangeRequestsDownload;

ChplChangeRequestsDownload.propTypes = {
  dispatch: func.isRequired,
  changeRequests: arrayOf(changeRequestProp).isRequired,
};
