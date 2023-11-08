import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { sortCqms } from 'services/cqms.service';
import { ListingContext, UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  fullWidth: {
    width: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    alignItems: 'flex-start',
    width: '100%',
  },
});

function ChplCqmsEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const classes = useStyles();

  const handleBasicChange = (event) => {
    setListing((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    formik.setFieldValue(event.target.name, event.target.value);
  };

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Box className={classes.column}>
        { (listing.edition === null || listing.edition.name === '2015')
          && (
            <Typography>
              Note 170.315 (c)(3) has two versions, so please check the criterion in the “Certification Criteria” section above to determine which version applies here.
            </Typography>
          )}
        <Card className={classes.fullWidth}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  { (listing.edition !== null && listing.edition.name) === '2011' ? 'Meets' : 'Version' }
                </TableCell>
                <TableCell>Quality Measure</TableCell>
                { (listing.edition === null || listing.edition.name === '2015')
                  && (
                    <TableCell>170.315 (c)(1)</TableCell>
                  )}
                { (listing.edition === null || listing.edition.name === '2015')
                  && (
                    <TableCell>170.315 (c)(2)</TableCell>
                  )}
                { (listing.edition === null || listing.edition.name === '2015')
                  && (
                    <TableCell>170.315 (c)(3)</TableCell>
                  )}
                { (listing.edition === null || listing.edition.name === '2015')
                  && (
                    <TableCell>170.315 (c)(4)</TableCell>
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              { listing.cqmResults
                .filter((cqm) => cqm.success) // add "view all" later
                .sort(sortCqms)
                .map((cqm) => (
                  <TableRow key={cqm.cmsId}>
                    <TableCell>
                  { !cqm.cmsId
                    && (
                      <>checkbox</>
                    )}
                  { cqm.cmsId
                    && (
                      <>multi-select</>
                    )}
                    </TableCell>
                    <TableCell>
                      { !cqm.cmsId
                        && (
                          <>NQF-{ cqm.nqfNumber }</>
                        )}
                      { cqm.cmsId
                        && (
                          <>{ cqm.cmsId }</>
                        )}
                      : { cqm.title }
                    </TableCell>
                    { (listing.edition === null || listing.edition.name === '2015')
                      && (
                        <TableCell>
                          1
                        </TableCell>
                      )}
                    { (listing.edition === null || listing.edition.name === '2015')
                      && (
                        <TableCell>
                          2
                        </TableCell>
                      )}
                    { (listing.edition === null || listing.edition.name === '2015')
                      && (
                        <TableCell>
                          3
                        </TableCell>
                      )}
                    { (listing.edition === null || listing.edition.name === '2015')
                      && (
                        <TableCell>
                          4
                        </TableCell>
                      )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </>
  );
}

export default ChplCqmsEdit;

ChplCqmsEdit.propTypes = {
};
