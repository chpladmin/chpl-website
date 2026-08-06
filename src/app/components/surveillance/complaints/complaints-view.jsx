import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useSnackbar } from 'notistack';
import { bool, string } from 'prop-types';

import ChplComplaint from './complaint';

import { useFetchComplaints, usePostReportRequest } from 'api/complaints';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import {
  ChplEllipsis,
  ChplLoadingCards,
  ChplPagination,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  card: {
    overflow: 'visible',
  },
  resultsContainer: {
    padding: 0,
  },
  emptyActions: {
    display: 'flex',
    gap: '8px',
    padding: '16px 0',
  },
  statusIndicatorOpen: {
    color: palette.active,
  },
  statusIndicatorClosed: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
});

function ChplComplaintsView(props) {
  const storageKey = 'storageKey-complaintsView';
  const { canAdd, canEdit, bonusQuery } = props;
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostReportRequest();
  const { hasAnyRole } = useContext(UserContext);
  const [activeComplaint, setActiveComplaint] = useState(undefined);
  const [complaints, setComplaints] = useState([]);
  const [order, setOrder] = useStorage(`${storageKey}-order`, 'desc');
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'received_date');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 10);
  const { queryString } = useFilterContext();
  const {
    data, isLoading, isSuccess,
  } = useFetchComplaints({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending: order === 'desc',
    query: `${queryString()}&${bonusQuery}`,
  });
  const classes = useStyles();

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    if (isLoading || !isSuccess || !data) { return; }
    const cs = data.results.map((item) => ({
      ...item,
    }));
    setComplaints(cs);
    if (activeComplaint?.id) {
      setActiveComplaint((inUseC) => cs.find((c) => c.id === inUseC.id));
    }
  }, [data, isLoading, isSuccess]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const sortOptions = [
    ...((hasAnyRole(['chpl-onc-acb']) || bonusQuery) ? [] : [{ property: 'certification_body', text: 'ONC-ACB' }]),
    { property: 'current_status', text: 'Status' },
    { property: 'received_date', text: 'Received Date', reverseDefault: true },
    { property: 'acb_complaint_id', text: 'ONC-ACB Complaint ID' },
    { property: 'onc_complaint_id', text: 'ONC Complaint ID' },
    { property: 'complainant_type', text: 'Complainant Type' },
  ];

  const downloadFile = () => {
    eventTrack({
      ...analytics,
      event: 'Download All Complaints',
    });
    mutate({}, {
      onSuccess: (response) => {
        enqueueSnackbar(`Your request has been submitted and you'll get an email at ${response.data.job.jobDataMap.email} when it's done`, {
          variant: 'success',
        });
      },
      onError: (error) => {
        const message = error.response.data.error;
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'add':
        eventTrack({
          ...analytics,
          event: 'Add New Complaint',
        });
        setActiveComplaint({});
        break;
      case 'close':
        setActiveComplaint(undefined);
        break;
      case 'view':
        eventTrack({
          ...analytics,
          event: 'View Complaint',
          label: payload.complainantType.name,
        });
        setActiveComplaint(payload);
        break;
      // no default
    }
  };

  const handleSort = (property, orderDirection) => {
    eventTrack({
      ...analytics,
      event: 'Sort Column',
      label: `${property} - ${orderDirection === 'desc' ? 'DESC' : 'ASC'}`,
    });
    setOrderBy(property);
    setOrder(orderDirection);
  };

  if (activeComplaint) {
    return (
      <ChplComplaint
        complaint={activeComplaint}
        dispatch={handleDispatch}
        canEdit={canEdit}
      />
    );
  }

  const getButtons = () => {
    if (hasAnyRole(['chpl-onc'])) {
      return (
        <Button
          onClick={downloadFile}
          color="secondary"
          variant="contained"
          id="download-results"
          endIcon={<CloudDownloadOutlinedIcon />}
          size="small"
        >
          Download all complaints
        </Button>
      );
    }
    if (hasAnyRole(['chpl-onc-acb'])) {
      if (canAdd) {
        return (
          <Button
            onClick={() => handleDispatch({ action: 'add' })}
            color="secondary"
            variant="contained"
            id="add-complaint"
            endIcon={<AddIcon />}
            size="small"
          >
            Add New Complaint
          </Button>
        );
      }
      return null;
    }
    if (canAdd) {
      return (
        <Box display="flex" gridGap="8px">
          <Button
            onClick={() => handleDispatch({ action: 'add' })}
            color="secondary"
            variant="contained"
            id="add-complaint"
            endIcon={<AddIcon />}
            size="small"
          >
            Add New Complaint
          </Button>
          <Button
            onClick={downloadFile}
            color="secondary"
            variant="contained"
            id="download-results"
            endIcon={<CloudDownloadOutlinedIcon />}
            size="small"
          >
            Download all complaints
          </Button>
        </Box>
      );
    }
    return (
      <Button
        onClick={downloadFile}
        color="secondary"
        variant="contained"
        id="download-results"
        endIcon={<CloudDownloadOutlinedIcon />}
        size="small"
      >
        Download all complaints
      </Button>
    );
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, data?.recordCount);

  return (
    <Card className={classes.card}>
      { bonusQuery
        && (
          <CardHeader title="Complaints" />
        )}
      <CardContent>
        <ChplFilterSearchBar
          sticky
          fadeBackground={palette.white}
          placeholder="Search by ONC-ACB Complaint ID, ONC Complaint ID, Associated Certified Product, or Associated Criteria"
        />
        <ChplFilterLayout>
          { isLoading
          && (
            <ChplLoadingCards />
          )}
          { !isLoading
          && (
            <>
              <ChplSearchResultControls
                recordCount={data?.recordCount ?? 0}
                pageStart={pageStart}
                pageEnd={pageEnd}
                fadeBackground={palette.white}
              >
                <ChplSortControls
                  sortOptions={sortOptions}
                  orderBy={orderBy}
                  order={order}
                  onSort={handleSort}
                />
                { getButtons() }
              </ChplSearchResultControls>
              { complaints.length === 0
                && (
                  <Box className={classes.emptyActions}>
                    { getButtons() }
                  </Box>
                )}
              { complaints.length > 0
                && (
                  <>
                    <Box className={classes.resultsContainer}>
                      { complaints.map((complaint) => {
                        const showAcb = !hasAnyRole(['chpl-onc-acb']) && !bonusQuery;
                        const primaryGroup = [];
                        if (showAcb) {
                          primaryGroup.push({ label: 'ONC-ACB', value: complaint.certificationBody.name });
                        }
                        primaryGroup.push({
                          label: 'Status',
                          value: (
                            <Typography
                              variant="subtitle1"
                              className={complaint.closedDate ? classes.statusIndicatorClosed : classes.statusIndicatorOpen}
                            >
                              {complaint.closedDate ? 'Closed' : 'Open'}
                            </Typography>
                          ),
                        });
                        primaryGroup.push({ label: 'Received Date', value: getDisplayDateFormat(complaint.receivedDate) });
                        return (
                          <ChplSearchResultCard
                            key={complaint.id}
                            cardTitle="ONC-ACB Complaint ID"
                            cardTitleValue={complaint.acbComplaintId || 'N/A'}
                            fieldGroups={[
                              primaryGroup,
                              [
                                {
                                  label: 'ONC Complaint ID',
                                  value: complaint.oncComplaintId
                                    ? (<ChplEllipsis text={complaint.oncComplaintId} maxLength={50} />)
                                    : 'N/A',
                                },
                                { label: 'Complaint Type(s)', value: complaint.complaintTypes?.map((t) => t.name).join(', ') || 'N/A' },
                                { label: 'Complainant Type', value: complaint.complainantType.name },
                              ],
                            ]}
                            actions={(
                              <Button
                                onClick={() => handleDispatch({ action: 'view', payload: complaint })}
                                variant="contained"
                                color="secondary"
                                id={`view-complaint-${complaint.id}`}
                                endIcon={<VisibilityIcon />}
                              >
                                View
                              </Button>
                            )}
                          />
                        );
                      })}
                    </Box>
                    <ChplPagination
                      count={data.recordCount}
                      page={pageNumber}
                      rowsPerPage={pageSize}
                      rowsPerPageOptions={[10, 50, 100, 250]}
                      setPage={setPageNumber}
                      setRowsPerPage={setPageSize}
                    />
                  </>
                )}
            </>
          )}
        </ChplFilterLayout>
      </CardContent>
    </Card>
  );
}

export default ChplComplaintsView;

ChplComplaintsView.propTypes = {
  canAdd: bool.isRequired,
  canEdit: bool.isRequired,
  bonusQuery: string.isRequired,
};
