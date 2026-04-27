import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { useFetchCodeSets } from 'api/standards';
import { UserContext } from 'shared/contexts';
import {
  certificationResult,
} from 'shared/prop-types';
import { getDisplayDateFormat, jsJoda } from 'services/date-util';
import { palette } from 'themes';

const useStyles = makeStyles({
  upToDate: {
    backgroundColor: palette.active,
    color: palette.white,
    '& .MuiChip-icon': {
      color: palette.white,
    },
  },
  notUpToDate: {
    backgroundColor: palette.error,
    color: palette.white,
    '& .MuiChip-icon': {
      color: palette.white,
    },
  },
});

function ChplCodeSetIndicator({ criterion }) {
  const { hasAnyRole } = useContext(UserContext);
  const { data, isError, isLoading } = useFetchCodeSets();
  const [allCodeSets, setAllCodeSets] = useState([]);
  const [codeSetStatus, setCodeSetStatus] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    if (isError || isLoading) { return; }
    setAllCodeSets(data);
  }, [data, isError, isLoading]);

  useEffect(() => {
    if (!allCodeSets || !criterion.codeSets) { return; }
    const today = jsJoda.LocalDate.now(jsJoda.ZoneId.of('America/New_York')).toString();
    const criterionCodeSetIds = new Set(criterion.codeSets.map((cs) => cs.codeSet.id));
    const missingRequired = allCodeSets
      .filter((cs) => cs.criteria?.some((c) => c.id === criterion.criterion.id) && cs.requiredDay)
      .find((cs) => cs.requiredDay <= today && !criterionCodeSetIds.has(cs.id));
    if (missingRequired) {
      setCodeSetStatus({ status: 'notUpToDate', requiredDay: missingRequired.requiredDay });
    }
    const latestRequired = allCodeSets
      .filter((cs) => cs.criteria?.some((c) => c.id === criterion.criterion.id) && cs.requiredDay)
      .filter((cs) => criterionCodeSetIds.has(cs.id))
      .sort((a, b) => (a.requiredDay > b.requiredDay ? -1 : 1))[0];
    setCodeSetStatus({ status: 'upToDate', requiredDay: latestRequired?.requiredDay });
  }, [allCodeSets, criterion]);

  if (isLoading || isError || !codeSetStatus) { return <CircularProgress />; }

  if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])) {
    return (
      <>
        { criterion.codeSets.length > 0
          && (
            <List>
              { criterion.codeSets.map((cs) => (
                <ListItem key={cs.id}>
                  { cs.codeSet.name }
                </ListItem>
              ))}
            </List>
          )}
        { criterion.codeSets?.length === 0 && 'None' }
      </>
    );
  }

  return (
    <Box display="flex" alignItems="center" gridGap={8}>
      { codeSetStatus.status === 'upToDate'
        && (
          <>
            <Chip
              icon={<RadioButtonCheckedIcon />}
              label="Up-to-date"
              className={classes.upToDate}
            />
            <Typography variant="body2">
              This criterion meets the current code set requirement.
              { codeSetStatus.requiredDay && (
                <>
                  {' The required date for this code set is '}
                  { getDisplayDateFormat(codeSetStatus.requiredDay) }
                  {'.'}
                </>
              )}
            </Typography>
          </>
        )}
      { codeSetStatus.status === 'notUpToDate'
        && (
          <>
            <Chip
              icon={<RadioButtonUncheckedIcon />}
              label="Not up-to-date"
              className={classes.notUpToDate}
            />
            <Typography variant="body2">
              This criterion&apos;s code set does not meet the requirement that took effect as of
              { codeSetStatus.requiredDay && (
                <>
                  {' '}
                  { getDisplayDateFormat(codeSetStatus.requiredDay) }
                </>
              )}
              . Contact the developer for more information.
            </Typography>
          </>
        )}
    </Box>
  );
}

export default ChplCodeSetIndicator;

ChplCodeSetIndicator.propTypes = {
  criterion: certificationResult.isRequired,
};
