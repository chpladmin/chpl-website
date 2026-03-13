import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { array, func, object } from 'prop-types';

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
      <Box className={classes.sbulSectionContainer}>
        <Typography gutterBottom component="h2" variant="h3">
          Section 2 &mdash; Listings
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gridGap="16px">
        <Card>
          <CardContent>
            <Typography gutterBottom variant="body1">
              Select the associated listing(s) for which you wish to update the Service Base URL List URL.
            </Typography>
          </CardContent>
        </Card>
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
                    <TableCell style={{
                      maxWidth: '400px', textOverflow: 'ellipsis', overflowWrap: 'anywhere', whiteSpace: 'normal',
                    }}
                    >
                      {l.serviceBaseUrlList.value}
                    </TableCell>
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
      </Box>
    </Container>
  );
}

export default ChplSbulWizardSection2;

ChplSbulWizardSection2.propTypes = {
  listings: array.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatch: func.isRequired,
  selectedListings: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
