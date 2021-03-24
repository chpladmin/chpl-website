import React, { useCallback, useEffect, useState } from 'react';
import { func } from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button, Checkbox, makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

import theme from '../../../themes/theme';
import { getAngularService } from './';
import { ChplSortableHeaders } from '../../../components/util/chpl-sortable-headers.jsx';

const useStyles = makeStyles(() => ({
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
}));

function ChplConfirmListings (props) {
  const [idsToReject, setIdsToReject] = useState([]);
  const [listings, setListings] = useState([]);
  const DateUtil = getAngularService('DateUtil');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const classes = useStyles();

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const loadListings = useCallback(() => {
    networkService.getPendingListings(true).then(response => {
      setListings(response);
      let pending = response.filter(l => l.errorCount === null || l.warningCount === null);
      if (pending.length > 0) {
        setTimeout(loadListings, 1000);
      }
    });
  }, [networkService]);

  const getStatus = listing => {
    return (
      <>
        { listing.errorCount !== null && listing.warningCount !== null
          ? <>
              { listing.errorCount + ' error' + (listing.errorCount !== 1 ? 's' : '') }
              <br />
              { listing.warningCount + ' warning' + (listing.warningCount !== 1 ? 's' : '') }
            </>
          : <>
              <CircularProgress />
            </>
        }
      </>
    );
  };

  const handleProcess = listing => {
    props.onProcess(listing.id);
  };

  const handleReject = () => {
    networkService.massRejectPendingListingsBeta(idsToReject)
      .then(() => {
        let message = 'Rejected ' + idsToReject.length + ' listing' + (idsToReject.length !== 1 ? 's' : '');
        toaster.pop({
          type: 'success',
          title: 'Success',
          body: message,
        });
        setIdsToReject([]);
        loadListings();
      }, error => {
        let message = 'Rejection of ' + idsToReject.length + ' listing' + (idsToReject.length !== 1 ? 's' : '') + ' failed';
        if (error?.data?.errorMessages) {
          message += '. ' + error.data.errorMessages.join(', ');
        }
        if (error?.data?.error) {
          message += '. ' + error.data.error;
        }
        toaster.pop({
          type: 'error',
          title: 'Error',
          body: message,
        });
      });
  };

  const handleRejectCheckbox = ($event, listing) => {
    if ($event.target.checked) {
      setIdsToReject([...idsToReject, listing.id]);
    } else {
      setIdsToReject(idsToReject.filter(id => id !== listing.id));
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    setListings(listings.sort(listingSortComparator(orderDirection + property)).map(listing => listing));
  };

  const listingSortComparator = (property) => {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return (a,b) => {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  };

  const headers = [
    {text: 'Action', invisible: true},
    {text: 'CHPL Product Number', property: 'chplProductNumber', sortable: true},
    {text: 'Developer', property: 'developer', sortable: true},
    {text: 'Product', property: 'product', sortable: true},
    {text: 'Version', property: 'version', sortable: true},
    {text: 'Certification Date', property: 'certificationDate', sortable: true},
    {text: 'Status'},
    {text: 'Reject Listing', invisible: true},
  ];

  return (
    <ThemeProvider theme={ theme }>
      { listings?.length > 0
        ? <>
            <TableContainer component={ Paper }>
              <Table size="small">
                <ChplSortableHeaders headers={ headers }
                                     onTableSort={ handleTableSort } />
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={ 7 } />
                    <TableCell align="right">
                      <Button id="reject-selected-pending-listings"
                              className={ classes.deleteButton }
                              variant="contained"
                              onClick={ handleReject }
                              startIcon={ <DeleteIcon/> }
                              disabled={ idsToReject.length === 0 }>
                        Reject { (idsToReject.length > 0) ? idsToReject.length : '' } selected
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableFooter>
                <TableBody>
                  { listings
                    .map(listing => (
                      <TableRow key={ listing.id } >
                        <TableCell>
                          <Button id={ 'process-pending-listing-' + listing.chplProductNumber }
                                  color="primary"
                                  variant="contained"
                                  onClick={() => handleProcess(listing)}
                                  endIcon={ <PlayArrowIcon/> }
                                  disabled={ listing.errorCount === null || listing.warningCount === null }>
                            Process Listing
                          </Button>
                        </TableCell>
                        <TableCell>{ listing.chplProductNumber }</TableCell>
                        <TableCell>{ listing.developer }</TableCell>
                        <TableCell>{ listing.product }</TableCell>
                        <TableCell>{ listing.version }</TableCell>
                        <TableCell>{ DateUtil.getDisplayDateFormat(listing.certificationDate) }</TableCell>
                        <TableCell>{ getStatus(listing) }</TableCell>
                        <TableCell align="right">
                          <Checkbox id={ 'reject-pending-listing-' + listing.chplProductNumber }
                                    onChange={($event) => handleRejectCheckbox($event, listing) }
                                    inputProps={{ 'aria-label': 'Reject Listing: ' + listing.chplProductNumber }} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        : <div>None found</div>
      }
    </ThemeProvider>
  );
}

export { ChplConfirmListings };

ChplConfirmListings.propTypes = {
  onProcess: func,
};
