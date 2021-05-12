import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  withStyles,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { object } from 'prop-types';

import {
  interpretActivity,
  interpretCertificationStatusChanges,
  interpretMuuHistory,
} from './history.service';
import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper.jsx';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      {children}
      {onClose
       && (
         <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
           <CloseIcon />
         </IconButton>
       )}
    </MuiDialogTitle>
  );
});

function ChplListingHistory(props) {
  const [activity, setActivity] = useState([]);
  const [listing] = useState(props.listing);
  const [open, setOpen] = React.useState(false);
  const networkService = getAngularService('networkService');
  const utilService = getAngularService('utilService');

  useEffect(() => {
    setActivity((activity) => [
      ...activity,
      ...interpretCertificationStatusChanges(listing),
      ...interpretMuuHistory(listing),
    ]);
    networkService.getSingleListingActivityMetadata(listing.id).then((response) => {
      response.forEach(item => networkService.getActivityById(item.id).then((response) => {
        let interpreted = interpretActivity(response, utilService);
        if (interpreted.change.length > 0) {
          setActivity((activity) => [
            ...activity,
            interpreted,
          ]);
        }
      }))
    });
  }, [listing]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Button color="primary" variant="outlined" onClick={handleClickOpen}>
        <i className="fa fa-eye"></i>
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="listing-history-title" open={open}>
        <DialogTitle id="listing-history-title" onClose={handleClose}>
          Listing History
        </DialogTitle>
        <DialogContent dividers>
          { activity.length > 0
            ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Activity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { activity.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          { item.activityDate }
                        </TableCell>
                        <TableCell>
                          <ul className="list-unstyled">
                            { item.change.map((change, idx) => (
                              <li key={idx} dangerouslySetInnerHTML={{__html: `${change}`}} />
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No changes have been made to this Listing</Typography>
            )
          }
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default ChplListingHistory;

ChplListingHistory.propTypes = {
  listing: object.isRequired,
};

/*
*/
/*

  <div class="product-history" role="modal" aria-labeled-by="title-label" id="product-history-modal">
  <div class="modal-header">
  <button class="btn btn-default pull-right" aria-label="Cancel history"
  ng-click="$ctrl.cancel()"><i class="fa fa-close"></i><span class="sr-only">Close modal</span></button>
  <h2 class="modal-title" id="title-label">Product History</h2>
  </div>
  <div class="modal-body">
  <span ng-if="!$ctrl.activity || $ctrl.activity.length === 0">No changes have been made to this Certified Product</span>
  <table class="table table-condensed" ng-if="$ctrl.activity && $ctrl.activity.length > 0" id="product-history-table">
  <thead>
  <tr>
  <th scope="col">Date</th>
  <th scope="col">Activity</th>
  </tr>
  </thead>
  <tbody>
  <tr ng-repeat="activity in $ctrl.activity | orderBy:'-activityDate'">
  <td>{{ activity.activityDate | date : 'medium' : 'UTC' }} GMT</td>
  <td>
  <ul class="list-unstyled">
  <li ng-repeat="change in activity.change | orderBy:'toString()'" ng-bind-html="change"></li>
  </ul>
  </td>
  </tr>
  </tbody>
  </table>
  </div>
  <div class="modal-footer">
  <span class="pull-right">
  <button class="btn btn-primary" ng-click="$ctrl.goToApi()">Go to API</button>
  <span ng-if="$ctrl.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])"><br /><button class="btn btn-default" ng-click="$ctrl.goToHistory()">Go to full history</button></span>
  </span>
  This module gives a basic overview of modifications made to the listing. For a more detailed history, please use the <code>/activity/certified_products/{{ $ctrl.listing.id }}</code> API call described on the CHPL API page.
  </div>
  </div>
*/
