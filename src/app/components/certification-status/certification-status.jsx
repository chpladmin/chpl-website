import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import { ChplDialogTitle } from 'components/util';
import { getStatusIcon } from 'services/listing.service';

const useStyles = makeStyles({
});

function ChplCertificationStatusLegend() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        id="view-certification-status-legend"
        aria-label="Open Certification Status Legend dialog"
        color="primary"
        variant="outlined"
        onClick={handleClickOpen}
      >
        <InfoIcon />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="certification-status-legend-title"
        open={open}
        maxWidth="md"
      >
        <ChplDialogTitle
          id="certification-status-legend-title"
          onClose={handleClose}
        >
          Certification Status Icon Legend
        </ChplDialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><span className="sr-only">Category</span></TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell rowSpan={3} scope="rowgroup">Active Certificates</TableCell>
                  <TableCell>{ getStatusIcon({ name: 'Active' }) }</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Product is certified and in good standing.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{ getStatusIcon({ name: 'Suspended by ONC' }) }</TableCell>
                  <TableCell>Suspended by ONC</TableCell>
                  <TableCell>Certification of the product has been suspended by ONC. While the product remains certified, the developer will be unable to update or certify new products during the suspension.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{ getStatusIcon({ name: 'Suspended by ONC-ACB' }) }</TableCell>
                  <TableCell>Suspended by ONC-ACB</TableCell>
                  <TableCell>Product&apos;s certification is suspended because corrective action plan not completed in time. The product is still considered certified, but it is at risk of having its certification withdrawn.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={3} scope="rowgroup">Decertified Products</TableCell>
                  <TableCell>{ getStatusIcon({ name: 'Terminated by ONC' }) }</TableCell>
                  <TableCell>Terminated by ONC</TableCell>
                  <TableCell>The certification of the product has been terminated by ONC.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{ getStatusIcon({ name: 'Withdrawn by Developer Under Surveillance/Review' }) }</TableCell>
                  <TableCell>Withdrawn by Developer Under Surveillance/Review</TableCell>
                  <TableCell>The certification of the product has been withdrawn by the developer while the product was under ONC-ACB surveillance or ONC direct review. It is no longer considered certified.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{ getStatusIcon({ name: 'Withdrawn by ONC-ACB' }) }</TableCell>
                  <TableCell>Withdrawn by ONC-ACB</TableCell>
                  <TableCell>Product&apos;s certification is withdrawn by the product&apos;s developer&apos;s ONC-ACB. No longer considered a certified product.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={2} scope="rowgroup">Inactive Certificates</TableCell>
                  <TableCell>{ getStatusIcon({ name: 'Withdrawn by Developer' }) }</TableCell>
                  <TableCell>Withdrawn by Developer</TableCell>
                  <TableCell>Product&apos;s certification is withdrawn by the product&apos;s developer. No longer a certified product.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{ getStatusIcon({ name: 'Retired' }) }</TableCell>
                  <TableCell>Retired</TableCell>
                  <TableCell>Product&apos;s certification is retired as part of HHS policy. It is no longer certified.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplCertificationStatusLegend;

ChplCertificationStatusLegend.propTypes = {
};
