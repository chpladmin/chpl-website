import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChplTextField } from 'components/util';
import { cqm as cqmPropType } from 'shared/prop-types';
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

function ChplCqmEdit(props) {
  const { cqm } = props;
  const { listing, setListing } = useContext(ListingContext);
  const classes = useStyles();

  const handleBasicChange = (event) => {
    setListing((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const toggle = (c) => {
    setListing({
      ...listing,
      cqmResults: listing.cqmResults
        .filter((c) => c.cmsId !== cqm.cmsId)
        .concat({
          ...cqm,
          criteria: cqm.criteria.some((cc) => cc.certificationNumber === `170.315 (c)(${c})`)
            ? cqm.criteria.filter((cc) => cc.certificationNumber !== `170.315 (c)(${c})`)
            : [...cqm.criteria].concat({ certificationNumber: `170.315 (c)(${c})`}),
        }),
    });
  };

  if (!listing) {
    return (
      <CircularProgress />
    );
  };

  return (
    <TableRow>
      <TableCell>
        { !cqm.cmsId
          && (
            <>checkbox</>
          )}
        { cqm.cmsId
          && (
            <>
              { /*
              <ChplTextField
                select
                id="version-select"
                name="versionSelect"
                label="Select a version"
                value={selectedVersion}
                onChange={(event) => add(event.target.value)}
                helperText={versions.length === 0 && 'At least one version must be selected'}
              >
                { versionOptions
                  .map((item) => (
                    <MenuItem
                      value={item}
                      key={item}
                      disabled={isDisabled(item)}
                    >
                      { item }
                    </MenuItem>
                  ))}
              </ChplTextField>
              <div className={classes.chips}>
                { criteria
                  .map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      onDelete={() => remove(item)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
              </div>
                */ }
              multi-select
            </>
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
      { (listing.edition === null || listing.edition.name === '2015') && [1, 2, 3, 4].map((v) => (
        <TableCell key={`${cqm.cmsId}-${v}`}>
          <Switch
            id={`${cqm.cmsId}-${v}`}
            color="primary"
            checked={cqm.criteria.some((cc) => cc.certificationNumber === `170.315 (c)(${v})`)}
            onChange={() => toggle(v)}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}

export default ChplCqmEdit;

ChplCqmEdit.propTypes = {
  cqm: cqmPropType.isRequired,
};
