import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, object } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { useFetchCodeSetsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const headers = [
  { text: 'CHPL Entry Value' },
  { text: 'Start Date' },
  { text: 'Required Date' },
  { text: 'Extension End Date' },
  { text: 'Applicable Criteria' },
];

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
      <div className={classes.tableResultsHeaderContainer}>
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
      </div>
      <TableContainer className={classes.container} component={Paper} style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
        <Table
          aria-label="Code Set table"
        >
          <ChplSortableHeaders
            headers={headers}
            stickyHeader={props.stickyHeader}
          />
          <TableBody>
            { codeSets
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={classes.firstColumn}>
                    { item.name }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.startDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.requiredDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.extensionEndDay) }
                  </TableCell>
                  <TableCell>
                    { item.criteriaDisplay }
                  </TableCell>
                  { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                    <TableCell align="right">
                      <Button
                        onClick={() => dispatch({ action: 'edit', payload: item })}
                        id={`edit-code-set-${item.name}`}
                        variant="contained"
                        color="secondary"
                        endIcon={<EditOutlinedIcon />}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplCodeSetsView;

ChplCodeSetsView.propTypes = {
  codeSets: arrayOf(object).isRequired,
  dispatch: func.isRequired,
};
