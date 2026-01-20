import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, object } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { useFetchCodeSetsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSearchResultCard } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer:{
      display: 'flex',
      justifyContent: 'flex-end',
  }
});

function ChplCodeSetsView(props) {
  const { dispatch } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [codeSets, setCodeSets] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setCodeSets(props.codeSets
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      })));
  }, [props.codeSets]);

  return (
    <>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">
            Code Sets
          </Typography>
          <Typography variant="body2">
            {`(${codeSets.length} Result${codeSets.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gridGap={4}>
          <ChplSystemMaintenanceActivity
            fetch={useFetchCodeSetsActivity}
            title="Code Sets"
          />
          { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
            <Button
              onClick={() => dispatch({ action: 'edit', payload: {} })}
              id="add-new-code-set"
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
        { codeSets
          .map((item) => (
            <ChplSearchResultCard
              key={item.id}
              title="CHPL Entry Value"
              titleValue={item.name}
              fieldGroups={[
                [
                  {
                    label: 'Start Date',
                    value: getDisplayDateFormat(item.startDay),
                    xs: 6,
                    sm: 4,
                  },
                  {
                    label: 'Required Date',
                    value: getDisplayDateFormat(item.requiredDay),
                    xs: 6,
                    sm: 4,
                  },
                  {
                    label: 'Extension End Date',
                    value: getDisplayDateFormat(item.extensionEndDay),
                    xs: 6,
                    sm: 4,
                  },
                ],
                [
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                    xs: 12,
                    sm: 12,
                  },
                ],
              ]}
              actions={
                hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                  <Button
                    onClick={() => dispatch({ action: 'edit', payload: item })}
                    id={`edit-code-set-${item.name}`}
                    variant="contained"
                    color="secondary"
                    size="small"
                    endIcon={<EditOutlinedIcon />}
                  >
                    Edit
                  </Button>
                )
              }
            />
          ))}
      </Box>
    </>
  );
}

export default ChplCodeSetsView;

ChplCodeSetsView.propTypes = {
  codeSets: arrayOf(object).isRequired,
  dispatch: func.isRequired,
};
