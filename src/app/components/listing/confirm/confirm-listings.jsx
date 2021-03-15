import React, { useState } from 'react';
import { arrayOf, func, number, shape, string } from 'prop-types';
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

import theme from '../../../themes/theme';
import { getAngularService } from './';
import { ChplSortableHeaders } from '../../../components/util/chpl-sortable-headers.jsx';
import { acb } from '../../../shared/prop-types/';

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
  const [listings, setListings] = useState(props.listings);
  const DateUtil = getAngularService('DateUtil');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const classes = useStyles();

  const getStatus = listing => {
    return listing.errorCount + ' error' + (listing.errorCount !== 1 ? 's' : '')
      + ' / ' + listing.warningCount + ' warning' + (listing.warningCount !== 1 ? 's' : '');
  };

  const handleProcess = listing => {
    props.onProcess(listing.id);
  };

  const handleReject = () => {
    networkService.massRejectPendingListingsBeta(idsToReject)
      .then(() => {
        props.onUpdate();
        let message = 'Rejected ' + idsToReject.length + ' listing' + (idsToReject.length !== 1 ? 's' : '');
        toaster.pop({
          type: 'success',
          title: 'Success',
          body: message,
        });
        setIdsToReject([]);
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
                                     onTableSort={ handleTableSort }
                                     order='asc'
                                     orderBy='chplProductNumber' />
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={ 7 } />
                    <TableCell align="right">
                      <Button className={ classes.deleteButton }
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
                          <Button color="primary"
                                  variant="contained"
                                  onClick={() => handleProcess(listing)}
                                  endIcon={ <PlayArrowIcon/> }>
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
                          <Checkbox onChange={($event) => handleRejectCheckbox($event, listing) }
                                    inputProps={{ 'aria-label': 'Reject Listing: ' + listing.chplProductNumber }}/>
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
  listings: arrayOf(shape({
    acb: acb,
    certificationDate: string,
    chplProductNumber: string,
    developer: string,
    errorCount: number,
    id: number,
    product: string,
    version: string,
    warningCount: number,
  })),
  onProcess: func,
  onUpdate: func,
};

/*
<div class="row" ng-if="$ctrl.hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])" ui-view>
  <div class="col-md-12">
    <h2>View Products in the process of upload</h2>
    <p ng-if="!$ctrl.uploadingCps || $ctrl.uploadingCps.length === 0">No products currently in queue</p>
    <div ng-if="$ctrl.uploadedListingsMessages">
      <ul>
        <li ng-repeat="message in $ctrl.uploadedListingsMessages">{{ message }}</li>
      </ul>
    </div>
    <table class="table table-striped" ng-if="$ctrl.uploadingCps.length > 0" id="pending-listings-table">
      <thead>
        <tr>
          <th scope="col">CHPL ID</th>
          <th scope="col">Developer</th>
          <th scope="col">Product</th>
          <th scope="col">Version</th>
          <th scope="col">Certification date</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
          <th scope="col">Mass Reject</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th colspan="7">&nbsp;</th>
          <th>
            <button class="btn btn-danger btn-block"
                    ng-disabled="$ctrl.getNumberOfListingsToReject() < 1"
                    confirm="Are you sure you wish to remove {{ $ctrl.getNumberOfListingsToReject() }} product{{ $ctrl.getNumberOfListingsToReject() > 1 ? 's' : '' }} from the queue?"
                    confirm-ok="Yes"
                    confirm-cancel="No"
                    confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
                    ng-click="$ctrl.massRejectPendingListings()"><i class="fa fa-trash-o"></i> Reject</button>
          </th>
        </tr>
      </tfoot>
      <tbody>
        <tr ng-repeat="cp in $ctrl.uploadingCps | orderBy: 'certificationDate' track by cp.id">
          <td>{{ cp.chplProductNumber }}</td>
          <td>{{ cp.developer.name }}</td>
          <td>{{ cp.product.name }}</td>
          <td>{{ cp.version.version }}</td>
          <td>{{ cp.certificationDate | date : 'mediumDate' : 'UTC' }}</td>
          <td>{{ cp.errorCount }} error<span ng-if="cp.errorCount !== 1">s</span> / {{ cp.warningCount }} warning<span ng-if="cp.warningCount !== 1">s</span></td>
          <td class="text-center">
            <button class="btn btn-ai-success btn-block" ng-click="$ctrl.inspectCp(cp.id)"
                    id="pending-listing-inspect-{{ cp.chplProductNumber }}"><i class="fa fa-eye"></i> Inspect</button>
          </td>
          <td class="text-center">
            <input type="checkbox" class="form-control" ng-model="$ctrl.massReject[cp.id]" id="pending-listing-reject-checkbox-{{ cp.id }}">
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="col-md-12" feature-flag="enhanced-upload">
    <h2>View (Beta) Products in the process of upload</h2>
    <p ng-if="!$ctrl.uploadedListings || $ctrl.uploadedListings.length === 0">No products currently in queue</p>
    <div ng-if="$ctrl.uploadedListingsMessages">
      <ul>
        <li ng-repeat="message in $ctrl.uploadedListingsMessages">{{ message }}</li>
      </ul>
    </div>
    <table class="table table-striped" ng-if="$ctrl.uploadedListings.length > 0" id="pending-listings-table-beta">
      <thead>
        <tr>
          <th scope="col">CHPL ID</th>
          <th scope="col">Developer</th>
          <th scope="col">Product</th>
          <th scope="col">Version</th>
          <th scope="col">Certification date</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
          <th scope="col">Mass Reject</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th colspan="7">&nbsp;</th>
          <th>
            <button class="btn btn-danger btn-block"
                    ng-disabled="$ctrl.getNumberOfListingsToRejectBeta() < 1"
                    confirm="Are you sure you wish to remove {{ $ctrl.getNumberOfListingsToRejectBeta() }} product{{ $ctrl.getNumberOfListingsToRejectBeta() > 1 ? 's' : '' }} from the queue?"
                    confirm-ok="Yes"
                    confirm-cancel="No"
                    confirm-settings="{animation: false, keyboard: false, backdrop: 'static'}"
                    ng-click="$ctrl.massRejectPendingListingsBeta()"><i class="fa fa-trash-o"></i> Reject</button>
          </th>
        </tr>
      </tfoot>
      <tbody>
        <tr ng-repeat="listing in $ctrl.uploadedListings | orderBy: 'certificationDate' track by listing.id">
          <td>{{ listing.chplProductNumber }}</td>
          <td>{{ listing.developer }}</td>
          <td>{{ listing.product }}</td>
          <td>{{ listing.version }}</td>
          <td>{{ $ctrl.DateUtil.getDisplayDateFormat(listing.certificationDate) }}</td>
          <td>{{ listing.errorCount }} error<span ng-if="listing.errorCount !== 1">s</span> / {{ listing.warningCount }} warning<span ng-if="listing.warningCount !== 1">s</span></td>
          <td class="text-center">
            <button class="btn btn-ai-success btn-block" ng-click="$ctrl.inspectListing(listing.id)"
                    id="pending-listing-inspect-{{ listing.chplProductNumber }}"><i class="fa fa-eye"></i> Inspect</button>
          </td>
          <td class="text-center">
            <input type="checkbox" class="form-control" ng-model="$ctrl.massRejectBeta[listing.id]" id="pending-listing-reject-checkbox-{{ listing.id }}">
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="row" ng-if="!$ctrl.hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])">
  <div class="col-md-6 col-md-offset-3 jumbotron">
    <chpl-login form-class=""
                p-class="bg-success lead"
                p-class-fail="bg-danger lead">
    </chpl-login>
  </div>
</div>
*/
