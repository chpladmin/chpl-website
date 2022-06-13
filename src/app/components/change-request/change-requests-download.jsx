import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  arrayOf,
  func,
  number,
  string,
} from 'prop-types';
import { ExportToCsv } from 'export-to-csv';

import fillCustomAttestationFields from './types/attestation-fill-fields';
import fillCustomDemographicsFields from './types/demographics-fill-fields';

import { useFetchChangeRequests, useFetchChangeRequestsLegacy } from 'api/change-requests';
import { getDisplayDateFormat } from 'services/date-util';

const PAGE_SIZE = 250;
const CUSTOM_FIELD_COUNT = 7;
const fillWithBlanks = (def = '') => Array(CUSTOM_FIELD_COUNT)
  .fill(def)
  .reduce((obj, v, idx) => ({
    ...obj,
    [`field${idx + 1}`]: v,
  }), {});

const getCustomFields = (item) => {
  switch (item.changeRequestType.name) {
    case 'Developer Attestation Change Request':
      return fillCustomAttestationFields(item.details);
    case 'Developer Demographics Change Request':
      return fillCustomDemographicsFields(item);
    default:
      return fillWithBlanks();
  }
};

const csvOptions = {
  showLabels: true,
  headers: [
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Request Type', objectKey: 'changeRequestTypeName' },
    { headerName: 'Creation Date', objectKey: 'friendlyReceivedDateTime' },
    { headerName: 'Request Status', objectKey: 'currentStatusName' },
    { headerName: 'Last Status Change', objectKey: 'friendlyCurrentStatusChangeDateTime' },
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
    query,
  } = props;
  const csvExporter = new ExportToCsv(csvOptions);
  const [changeRequests, setChangeRequests] = useState([]);
  const [changeRequestsIds, setChangeRequestsIds] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const { data: legacyData, isLoading: legacyIsLoading, isSuccess: legacyIsSuccess } = useFetchChangeRequestsLegacy();
  const { isLoading, isSuccess, data } = useFetchChangeRequests({
    pageNumber,
    pageSize: PAGE_SIZE,
    query,
  });
  const classes = useStyles();

  useEffect(() => {
    if (legacyIsLoading || !legacyIsSuccess) {
      return;
    }
    const crs = legacyData
      .map((item) => ({
        ...item,
        ...getCustomFields(item),
        developerName: item.developer.name,
        changeRequestTypeName: item.changeRequestType.name,
        friendlyReceivedDateTime: getDisplayDateFormat(item.submittedDate),
        currentStatusName: item.currentStatus.changeRequestStatusType.name,
        friendlyCurrentStatusChangeDateTime: getDisplayDateFormat(item.currentStatus.statusChangeDate),
        relevantAcbs: item.certificationBodies.sort((a, b) => (a.name < b.name ? -1 : 1)).map((acb) => acb.name).join(';'),
      }))
      .filter((item) => changeRequestsIds.includes(item.id));
    setChangeRequests(crs);
  }, [legacyData, legacyIsLoading, legacyIsSuccess, changeRequestsIds]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setChangeRequestsIds((ids) => ids.concat(data.results.map((item) => item.id)));
    if ((data.pageNumber + 1) * PAGE_SIZE < data.recordCount) {
      setPageNumber((page) => page + 1);
    }
  }, [data, isLoading, isSuccess]);

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
        { changeRequests.length === 0
          && (
            <CircularProgress />
          )}
        { changeRequests.length > 0
          && (
            <Button
              onClick={download}
              disabled={changeRequests.length === 0}
            >
              Download
            </Button>
          )}
      </CardContent>
    </Card>
  );
}

export default ChplChangeRequestsDownload;

ChplChangeRequestsDownload.propTypes = {
  dispatch: func.isRequired,
  query: string.isRequired,
};
