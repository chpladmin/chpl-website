import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SortIcon from '@material-ui/icons/Sort';

import { useFetchFunctionalitiesTestedActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplUpdateIndicator } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { functionalityTested as functionalityTestedPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  }
});

function ChplFunctionalitiesTestedView(props) {
  const { dispatch } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [functionalitiesTested, setFunctionalitiesTested] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setFunctionalitiesTested(props.functionalitiesTested
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.value,
        item.regulatoryTextCitation,
        item.rule?.name,
        item.practiceType?.name,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('value')));
  }, [props.functionalitiesTested, filterContext.filters, filterContext.searchTerm]);

  const handleCardSort = (property) => {
    const newOrder = orderBy === property && order === 'asc' ? 'desc' : 'asc';
    const descending = newOrder === 'desc';
    const updated = functionalitiesTested.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(newOrder);
    setFunctionalitiesTested(updated);
    setSortMenuAnchor(null);
  };

  const toggleSortDirection = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    const descending = newOrder === 'desc';
    const updated = functionalitiesTested.sort(sortComparator(orderBy, descending));
    setOrder(newOrder);
    setFunctionalitiesTested(updated);
  };

  const getSortLabel = (field) => {
    const labels = {
      value: 'Value',
      regulatoryTextCitation: 'Citation',
      startDay: 'Start Date',
      requiredDay: 'Required Date',
      extensionEndDay: 'Extension End',
      endDay: 'End Date',
    };
    return labels[field] || field;
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value, Citation, Rule, or Practice Type..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mx={8} my={2}>
        <Box display="flex" flexDirection="row" gap={1}>
          <Typography variant="subtitle2">
            Search Results:
          </Typography>
          <Typography variant="body2">
            {`(${functionalitiesTested.length} Result${functionalitiesTested.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <div className={classes.tableResultsHeaderContainer}>
          <Box display="flex" alignItems="center" mr={1}>
              <ButtonGroup color="primary" size="small" variant="outlined">
                <Button
                  onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                  startIcon={<SortIcon />}
                  color="primary"
                  style={{ padding: "9px 12px" }}
                >
                  {getSortLabel(orderBy)}
                </Button>
                <Button
                  onClick={toggleSortDirection}
                  aria-label={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
                  title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
                  style={{ minWidth: '40px', padding: "9px 4px" }}
                  color="primary"
                >
                  {order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                </Button>
              </ButtonGroup>
              <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={() => setSortMenuAnchor(null)}
              >
                <MenuItem onClick={() => handleCardSort('value')}>Value</MenuItem>
                <MenuItem onClick={() => handleCardSort('regulatoryTextCitation')}>Citation</MenuItem>
                <MenuItem onClick={() => handleCardSort('startDay')}>Start Date</MenuItem>
                <MenuItem onClick={() => handleCardSort('requiredDay')}>Required Date</MenuItem>
                <MenuItem onClick={() => handleCardSort('extensionEndDay')}>Extension End</MenuItem>
                <MenuItem onClick={() => handleCardSort('endDay')}>End Date</MenuItem>
              </Menu>
            </Box>
          <ChplSystemMaintenanceActivity
            fetch={useFetchFunctionalitiesTestedActivity}
            title="Functionalities Tested"
          />
          {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
            <Button
              onClick={() => dispatch({ action: 'edit', payload: {} })}
              id="add-new-functionality-tested"
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
            >
              Add
            </Button>
          )}
        </div>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
          {functionalitiesTested
            .map((item) => (
              <Card key={`${item.id}-${item.value}`} style={{ marginBottom: '12px' }}>
                <CardContent style={{ padding: '8px' }}>
                  <Typography variant="body2" display="block" color="primary">Value</Typography>
                  <Grid container spacing={2} style={{ padding: '4px' }} alignItems="center">
                    <Box display="flex" flex={1} gridGap={2} justifyContent="space-between" alignItems="center">
                      <Typography variant="body1">
                        {item.value}
                        {item.retired && ' (Retired)'}
                      </Typography>
                      <ChplUpdateIndicator
                        requiredDay={item.requiredDay}
                        endDay={item.endDay}
                        additionalInformation={item.additionalInformation}
                      />
                    </Box>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2} sm={2}>
                      <Typography variant="caption" display="block" color="primary">Regulatory Text Citation</Typography>
                      <Typography variant="body2">{item.regulatoryTextCitation || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Typography variant="caption" display="block" color="primary">Rule</Typography>
                      <Typography variant="body2">{item.rule?.name ?? 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Typography variant="caption" display="block" color="primary">Practice Type</Typography>
                      <Typography variant="body2">{item.practiceType?.name ?? 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <Typography variant="caption" display="block" color="primary">Applicable Criteria</Typography>
                      <Typography variant="body2">{item.criteriaDisplay || 'N/A'}</Typography>
                    </Grid>
                    {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                      <Grid item xs={12} sm="auto" style={{ marginLeft: 'auto' }}>
                        <Button
                          onClick={() => dispatch({ action: 'edit', payload: item })}
                          id={`edit-functionality-tested-${item.value}`}
                          variant="contained"
                          color="secondary"
                          size="small"
                          endIcon={<EditOutlinedIcon />}
                        >
                          Edit
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                   <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6} sm={2}>
                      <Typography variant="caption" display="block" color="primary">Start Date</Typography>
                      <Typography variant="body2">{getDisplayDateFormat(item.startDay) || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>

                      <Typography variant="caption" display="block" color="primary">End Date</Typography>
                      <Typography variant="body2">{getDisplayDateFormat(item.endDay) || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Typography variant="caption" display="block" color="primary">Required Date</Typography>
                      <Typography variant="body2">{getDisplayDateFormat(item.requiredDay) || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Typography variant="caption" display="block" color="primary">Extension End Date</Typography>
                      <Typography variant="body2">{getDisplayDateFormat(item.extensionEndDay) || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
      </Box>
    </>
  );
}

export default ChplFunctionalitiesTestedView;

ChplFunctionalitiesTestedView.propTypes = {
  dispatch: func.isRequired,
  functionalitiesTested: arrayOf(functionalityTestedPropType).isRequired,
};
