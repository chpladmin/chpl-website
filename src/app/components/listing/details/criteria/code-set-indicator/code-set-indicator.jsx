import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';

import { useFetchCodeSets } from 'api/standards';
import { ChplUpdateIndicator } from 'components/util';
import { UserContext } from 'shared/contexts';
import { certificationResult } from 'shared/prop-types';

function ChplCodeSetIndicator({ criterion }) {
  const { hasAnyRole } = useContext(UserContext);
  const { data, isError, isLoading } = useFetchCodeSets();
  const [relevantCodeSets, setRelevantCodeSets] = useState([]);
  const [endDay, setEndDay] = useState(undefined);

  useEffect(() => {
    if (isError || isLoading) { return; }
    setRelevantCodeSets(data.filter((cs) => cs.criteria.some((cc) => cc.id === criterion.criterion.id)));
  }, [data, isError, isLoading]);

  useEffect(() => {
    const missingDays = relevantCodeSets
      .filter((cs) => !criterion.codeSets.some((ccs) => ccs.codeSet.id === cs.id))
      .map((cs) => cs.requiredDay)
      .sort((a, b) => (a < b ? -1 : 1));
    setEndDay(missingDays[0]);
  }, [criterion, relevantCodeSets]);

  if (isLoading || isError) { return <CircularProgress />; }

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
      <Typography>
        { endDay ? 'Update Required' : 'Current' }
      </Typography>
      <ChplUpdateIndicator
        endDay={endDay}
      />
    </Box>
  );
}

export default ChplCodeSetIndicator;

ChplCodeSetIndicator.propTypes = {
  criterion: certificationResult.isRequired,
};
