import React, { useContext, useState } from 'react';
import {
  Chip,
  CircularProgress,
  MenuItem,
  Switch,
  TableCell,
  TableRow,
  makeStyles,
} from '@material-ui/core';

import { ChplTextField } from 'components/util';
import { cqm as cqmPropType } from 'shared/prop-types';
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

const sortVersions = (a, b) => parseInt(a.substring(1), 10) - parseInt(b.substring(1), 10);

function ChplCqmEdit(props) {
  const { cqm } = props;
  const { listing, setListing } = useContext(ListingContext);
  const [selectedVersion, setSelectedVersion] = useState('');
  const classes = useStyles();

  const add = (v) => {
    setListing({
      ...listing,
      cqmResults: listing.cqmResults
        .filter((c) => c.cmsId !== cqm.cmsId)
        .concat({
          ...cqm,
          successVersions: [].concat(cqm.successVersions).concat(v),
        }),
    });
    setSelectedVersion('');
  };

  const isDisabled = (v) => cqm.successVersions.includes(v);

  const remove = (v) => {
    setListing({
      ...listing,
      cqmResults: listing.cqmResults
        .filter((c) => c.cmsId !== cqm.cmsId)
        .concat({
          ...cqm,
          successVersions: cqm.successVersions.filter((sv) => sv !== v),
        }),
    });
  };

  const toggle = (v) => {
    setListing({
      ...listing,
      cqmResults: listing.cqmResults
        .filter((c) => c.cmsId !== cqm.cmsId)
        .concat({
          ...cqm,
          criteria: cqm.criteria.some((cc) => cc.certificationNumber === `170.315 (c)(${v})`)
            ? cqm.criteria.filter((cc) => cc.certificationNumber !== `170.315 (c)(${v})`)
            : [...cqm.criteria].concat({ certificationNumber: `170.315 (c)(${v})` }),
        }),
    });
  };

  const toggleSuccess = () => {
    setListing({
      ...listing,
      cqmResults: listing.cqmResults
        .filter((c) => c.nqfNumber !== cqm.nqfNumber)
        .concat({
          ...cqm,
          success: !cqm.success,
        }),
    });
  };

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <TableRow>
      <TableCell>
        { !cqm.cmsId
          && (
            <Switch
              id={`${cqm.nqfNumber}-success`}
              color="primary"
              checked={cqm.success}
              onChange={() => toggleSuccess()}
            />
          )}
        { cqm.cmsId
          && (
            <>
              <ChplTextField
                select
                id="version-select"
                name="versionSelect"
                label="Select a version"
                value={selectedVersion}
                onChange={(event) => add(event.target.value)}
                helperText={cqm.successVersions.length === 0 && 'At least one version must be selected'}
              >
                { cqm.allVersions
                  .sort(sortVersions)
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
                { cqm.successVersions
                  .sort(sortVersions)
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
            </>
          )}
      </TableCell>
      <TableCell>
        { !cqm.cmsId
          && (
            <>
              NQF-
              { cqm.nqfNumber }
            </>
          )}
        { cqm.cmsId
          && (
            <>{ cqm.cmsId }</>
          )}
        :
        {' '}
        { cqm.title }
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
