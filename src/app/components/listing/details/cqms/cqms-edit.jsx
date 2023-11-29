import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { bool } from 'prop-types';

import ChplCqmEdit from './cqm-edit';

import { sortCqms } from 'services/cqms.service';
import { ListingContext } from 'shared/contexts';
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

function ChplCqmsEdit({ viewAll: initialViewAll }) {
  const { listing } = useContext(ListingContext);
  const [viewAll, setViewAll] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setViewAll(initialViewAll);
  }, [initialViewAll]);

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
                { (listing.edition === null || listing.edition.name === '2015') && [1, 2, 3, 4].map((v) => (
                  <TableCell className="no-br" key={`170.315 (c)(${v})`}>
                    { `170.315 (c)(${v})` }
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              { listing.cqmResults
                .filter((cqm) => viewAll || cqm.success || cqm.successVersions?.length > 0)
                .sort(sortCqms)
                .map((cqm) => (
                  <ChplCqmEdit
                    key={cqm.cmsId ?? cqm.nqfNumber}
                    cqm={cqm}
                  />
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
  viewAll: bool.isRequired,
};
