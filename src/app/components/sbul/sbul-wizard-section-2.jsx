import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { array, func, object, string } from 'prop-types';

import { interpretEmphatic, interpretLink } from './attestation-util';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 450px)',
  },
  nonCaps: {
    textTransform: 'none',
  },
  questionParagraph: {
    marginBottom: '8px',
  },
  radioGroup: {
    textTransform: 'none',
  },
  warningBox: {
    padding: '16px',
    backgroundColor: '#fdfde7',
    border: '1px solid #afafaf',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '4px',
    marginBottom: '16px',
    gridGap: '16px',
    alignItems: 'center',
  },
});

function ChplSbulWizardSection2({ dispatch, listings, selectedListings }) {
  const classes = useStyles();

  const toggle = (listing) => {
    dispatch(listing.id);
  };

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="md">
      <Typography gutterBottom variant="h2">
        Section 2 &mdash; Listings
      </Typography>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell scope="col">CHPL Product Number</TableCell>
                <TableCell scope="col">Service Base URL List</TableCell>
                <TableCell scope="col">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { listings.map((l) => (
                <TableRow
                  key={l.chplProductNumber}
                >
                  <TableCell>{l.chplProductNumber}</TableCell>
                  <TableCell>{l.serviceBaseUrlList.value}</TableCell>
                  <TableCell>
                    <Checkbox
                      onChange={() => toggle(l)}
                      checked={selectedListings.has(l.id)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplSbulWizardSection2;

ChplSbulWizardSection2.propTypes = {
  listings: array.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatch: func.isRequired,
  selectedListings: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
