import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useSnackbar } from 'notistack';
import { bool, string } from 'prop-types';

import ChplComplaint from './complaint';

import { useFetchComplaints, usePostReportRequest } from 'api/complaints';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplEllipsis, ChplPagination } from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { BreadcrumbContext, UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    maxHeight: '64vh',
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
  statusIndicatorOpen: {
    color: '#66926d',
  },
  statusIndicatorClosed: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
});

function ChplComplaintsView(props) {
  const storageKey = 'storageKey-complaintsView';
  const { canAdd, bonusQuery } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostReportRequest();
  const { append, display, hide } = useContext(BreadcrumbContext);
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
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="surveillance.disabled"
        variant="text"
        disabled
      >
        Surveillance
      </Button>,
    );
    append(
      <Button
        key="viewall.disabled"
        variant="text"
        disabled
      >
        Complaints Reporting
      </Button>,
    );
    append(
      <Button
        key="viewall"
        variant="text"
        onClick={() => handleDispatch({ action: 'close' })}
      >
        Complaints Reporting
      </Button>,
    );
    display('surveillance.disabled');
    display('viewall.disabled');
  }, []);

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
  const headers = (hasAnyRole(['chpl-onc-acb']) || bonusQuery) ? [
    { property: 'current_status', text: 'Status', sortable: true },
    { property: 'received_date', text: 'Received Date', sortable: true, reverseDefault: true },
    { property: 'acb_complaint_id', text: 'ONC-ACB Complaint ID', sortable: true },
    { property: 'onc_complaint_id', text: 'ONC Complaint ID', sortable: true },
    { property: 'complainant_type', text: 'Complainant Type', sortable: true },
    { property: 'actions', text: 'Actions', invisible: true },
  ] : [
    { property: 'certification_body', text: 'ONC-ACB', sortable: true },
    { property: 'current_status', text: 'Status', sortable: true },
    { property: 'received_date', text: 'Received Date', sortable: true, reverseDefault: true },
    { property: 'acb_complaint_id', text: 'ONC-ACB Complaint ID', sortable: true },
    { property: 'onc_complaint_id', text: 'ONC Complaint ID', sortable: true },
    { property: 'complainant_type', text: 'Complainant Type', sortable: true },
    { property: 'actions', text: 'Actions', invisible: true },
  ];

  const downloadFile = () => {
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

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'add':
        setActiveComplaint({});
        display('viewall');
        hide('viewall.disabled');
        break;
      case 'close':
        setActiveComplaint(undefined);
        display('viewall.disabled');
        hide('viewall');
        hide('add.disabled');
        hide('edit.disabled');
        hide('view');
        hide('view.disabled');
        break;
      case 'view':
        setActiveComplaint(payload);
        display('viewall');
        hide('viewall.disabled');
        break;
      // no default
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    setOrderBy(property);
    setOrder(orderDirection);
  };

  const showBreadcrumbs = () => !bonusQuery;

  if (activeComplaint) {
    return (
      <ChplComplaint
        complaint={activeComplaint}
        dispatch={handleDispatch}
        showBreadcrumbs={showBreadcrumbs()}
      />
    );
  }

  const getButtons = () => {
    if (hasAnyRole(['chpl-onc'])) {
      return (
        <ButtonGroup className={classes.wrap}>
          <Button
            onClick={downloadFile}
            color="primary"
            variant="contained"
            id="download-results"
            endIcon={<GetAppIcon />}
          >
            Download all complaints
          </Button>
        </ButtonGroup>
      );
    }
    if (hasAnyRole(['chpl-onc-acb'])) {
      if (canAdd) {
        return (
          <ButtonGroup className={classes.wrap}>
            <Button
              onClick={() => handleDispatch({ action: 'add' })}
              color="primary"
              variant="outlined"
              id="add-complaint"
              endIcon={<AddIcon />}
            >
              Add New Complaint
            </Button>
          </ButtonGroup>
        );
      }
      return null;
    }
    if (canAdd) {
      return (
        <ButtonGroup className={classes.wrap}>
          <Button
            onClick={() => handleDispatch({ action: 'add' })}
            color="primary"
            variant="outlined"
            id="add-complaint"
            endIcon={<AddIcon />}
          >
            Add New Complaint
          </Button>
          <Button
            onClick={downloadFile}
            color="primary"
            variant="contained"
            id="download-results"
            endIcon={<GetAppIcon />}
          >
            Download all complaints
          </Button>
        </ButtonGroup>
      );
    }
    return (
      <ButtonGroup className={classes.wrap}>
        <Button
          onClick={downloadFile}
          color="primary"
          variant="contained"
          id="download-results"
          endIcon={<GetAppIcon />}
        >
          Download all complaints
        </Button>
      </ButtonGroup>
    );
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, data?.recordCount);

  return (
    <Card>
      { bonusQuery
        && (
          <CardHeader title="Complaints" />
        )}
      <CardContent>
        <ChplFilterSearchBar
          placeholder="Search by ONC-ACB Complaint ID, ONC Complaint ID, Associated Certified Product, or Associated Criteria"
        />
        <div>
          <ChplFilterChips />
        </div>
        { isLoading
          && (
            <CircularProgress />
          )}
        { !isLoading
          && (
            <>
              <div className={classes.tableResultsHeaderContainer}>
                <div className={`${classes.resultsContainer} ${classes.wrap}`}>
                  <Typography variant="subtitle2">Search Results:</Typography>
                  { complaints.length === 0
                    && (
                      <>
                        No results found
                      </>
                    )}
                  { complaints.length > 0
                    && (
                      <Typography variant="body2">
                        {`(${pageStart}-${pageEnd} of ${data?.recordCount} Results)`}
                      </Typography>
                    )}
                </div>
                { getButtons() }
              </div>
              { complaints.length > 0
                && (
                  <>
                    <TableContainer className={classes.container} component={Paper}>
                      <Table
                        stickyHeader
                        aria-label="Complaints table"
                      >
                        <ChplSortableHeaders
                          headers={headers}
                          onTableSort={handleTableSort}
                          orderBy={orderBy}
                          order={order}
                          stickyHeader
                        />
                        <TableBody>
                          {complaints
                            .map((complaint) => (
                              <TableRow key={complaint.id}>
                                { !hasAnyRole(['chpl-onc-acb']) && !bonusQuery
                                 && (
                                   <TableCell>{complaint.certificationBody.name}</TableCell>
                                 )}
                                <TableCell>
                                  <Typography
                                    variant="subtitle1"
                                    className={complaint.closedDate ? classes.statusIndicatorClosed : classes.statusIndicatorOpen}
                                  >
                                    {complaint.closedDate ? 'Closed' : 'Open'}
                                  </Typography>
                                </TableCell>
                                <TableCell>{getDisplayDateFormat(complaint.receivedDate)}</TableCell>
                                <TableCell>{complaint.acbComplaintId}</TableCell>
                                <TableCell>
                                  { complaint.oncComplaintId && <ChplEllipsis text={complaint.oncComplaintId} maxLength={50} /> }
                                </TableCell>
                                <TableCell>{complaint.complainantType.name}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    onClick={() => handleDispatch({ action: 'view', payload: complaint })}
                                    variant="contained"
                                    color="primary"
                                    id={`view-complaint-${complaint.id}`}
                                    endIcon={<VisibilityIcon />}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
      </CardContent>
    </Card>
  );
}

export default ChplComplaintsView;

ChplComplaintsView.propTypes = {
  canAdd: bool.isRequired,
  bonusQuery: string.isRequired,
};
