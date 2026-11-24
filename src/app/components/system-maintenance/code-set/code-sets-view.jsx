import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, IconButton,
} from '@mui/material';
import { arrayOf, func, shape } from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoIcon from '@mui/icons-material/Info';

import { useFetchCodeSetsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import {
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplTooltip,
  ChplUpdateIndicator,
} from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';

function ChplCodeSetsView({ dispatch, codeSets: initialCodeSets }) {
  const { hasAnyRole } = useContext(UserContext);
  const [codeSets, setCodeSets] = useState([]);

  useEffect(() => {
    setCodeSets(initialCodeSets
      .map((item) => ({
        ...item,
        criteriaDisplay: [...item.criteria]
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      })));
  }, [initialCodeSets]);

  return (
    <>
      <ChplSearchResultControls
        recordCount={codeSets.length}
        pageStart={1}
        pageEnd={codeSets.length}
        sticky={false}
        wrapActions
        showEmptyState
        sx={resultsHeaderSx}
      >
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
      </ChplSearchResultControls>
      <Box>
        { codeSets
          .map((item) => (
            <ChplSearchResultCard
              sx={resultCardSx}
              key={item.id}
              cardTitle="CHPL Entry Value"
              cardTitleValue={item.name}
              titleIconButton={(
                <ChplTooltip title="Use this value in a upload file">
                  <IconButton color="primary" size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </ChplTooltip>
            )}
              additionalTitleContent={(
                <ChplUpdateIndicator
                  endDay={item.requiredDay}
                  additionalInformation="Contact the developer for more information."
                />
            )}
              fieldGroups={[
                [
                  {
                    label: 'Start Date',
                    value: getDisplayDateFormat(item.startDay),
                  },
                  {
                    label: 'Required Date',
                    value: getDisplayDateFormat(item.requiredDay),
                  },
                  {
                    label: 'Extension End Date',
                    value: getDisplayDateFormat(item.extensionEndDay),
                  },
                ],
                [
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
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
  codeSets: arrayOf(shape({})).isRequired,
  dispatch: func.isRequired,
};
