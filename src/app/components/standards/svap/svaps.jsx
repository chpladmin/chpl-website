import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { useSnackbar } from 'notistack';
import { func } from 'prop-types';

import ChplSvapEdit from './svap-edit';
import ChplSvapsView from './svaps-view';

import {
  useDeleteSvap,
  useFetchCriteriaForSvaps,
  useFetchSvaps,
  usePostSvap,
  usePutSvap,
} from 'api/standards';
import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { BreadcrumbContext, UserContext } from 'shared/contexts';

const headers = [
  { property: 'citation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'standard', text: 'Approved Standard Version', sortable: true },
  { property: 'criteria', text: 'Applicable Criteria' },
  { property: 'replaced', text: 'Replaced', sortable: true },
  { property: 'actions', text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  container: {
    maxHeight: '64vh',
  },
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
  breadcrumbs: {
    textTransform: 'none',
  },
});

const resetBreadcrumbs = (append, drop, classes, dispatch) => {
  drop('standards.disabled');
  append(
    <Button
      key="standards"
      variant="text"
      className={classes.breadcrumbs}
      onClick={() => dispatch('reset')}
    >
      Standards &amp; Processes
    </Button>,
    <Button
      key="svaps.viewall.disabled"
      variant="text"
      className={classes.breadcrumbs}
      disabled
    >
      SVAP Maintenance
    </Button>,
  );
};

function ChplSvaps(props) {
  const { dispatch } = props;
  const { append, drop } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchSvaps();
  const deleteSvap = useDeleteSvap();
  const postSvap = usePostSvap();
  const putSvap = usePutSvap();
  const criterionOptionsQuery = useFetchCriteriaForSvaps();
  const { enqueueSnackbar } = useSnackbar();
  const [activeSvap, setActiveSvap] = useState(undefined);
  const [criterionOptions, setCriterionOptions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [svaps, setSvaps] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    resetBreadcrumbs(append, drop, classes, dispatch);
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setSvaps(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criterionOptionsQuery.isLoading || !criterionOptionsQuery.isSuccess) { return; }
    setCriterionOptions(criterionOptionsQuery.data);
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  const handleDispatch = ({action, payload}) => {
    switch (action) {
      case 'cancel':
        setActiveSvap(undefined);
        break;
      case 'delete':
        setErrors([]);
        deleteSvap.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('SVAP Deleted', {
              variant: 'success',
            });
            setActiveSvap(undefined);
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveSvap(payload);
        setErrors([]);
        break;
      case 'save':
        setErrors([]);
        if (payload.svapId) {
          putSvap.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('SVAP Updated', {
                variant: 'success',
              });
              setActiveSvap(undefined);
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postSvap.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('SVAP Created', {
                variant: 'success',
              });
              setActiveSvap(undefined);
            },
            onError: (error) => {
              setErrors(error.response.data?.errorMessages);
            },
          });
        }
        break;
        // no default
    }
  };

  if (isLoading || !isSuccess || svaps.length === 0) {
    return (
      <>
        <CircularProgress/>
      </>
    );
  }

  if (activeSvap) {
    return (
      <ChplSvapEdit
        svap={activeSvap}
        dispatch={handleDispatch}
        criterionOptions={criterionOptions}
        errors={errors}
      />
    );
  }

  return (
    <Card>
      <CardHeader title="SVAP Maintenance" />
      <CardContent>
        <ChplSvapsView
          svaps={svaps}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplSvaps;

ChplSvaps.propTypes = {
  dispatch: func.isRequired,
};
