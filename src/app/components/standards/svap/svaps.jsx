import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplSvapEdit from './svap-edit';
import ChplSvapsView from './svaps-view';

import {
  useDeleteSvap,
  useFetchCriteriaForSvaps,
  useFetchSvaps,
  usePostSvap,
  usePutSvap,
} from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

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

function ChplSvaps() {
  const { append, display, hide } = useContext(BreadcrumbContext);
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
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="svaps.viewall.disabled"
        depth={1}
        variant="text"
        className={classes.breadcrumbs}
        disabled
      >
        SVAP Maintenance
      </Button>,
    );
    append(
      <Button
        key="svaps.viewall"
        depth={1}
        variant="text"
        className={classes.breadcrumbs}
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        SVAP Maintenance
      </Button>,
    );
    display('svaps.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setSvaps(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criterionOptionsQuery.isLoading || !criterionOptionsQuery.isSuccess) { return; }
    setCriterionOptions(criterionOptionsQuery.data);
  }, [criterionOptionsQuery.data, criterionOptionsQuery.isLoading, criterionOptionsQuery.isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveSvap(undefined);
        display('svaps.viewall.disabled');
        hide('svaps.viewall');
        hide('svaps.add.disabled');
        hide('svaps.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteSvap.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('SVAP Deleted', {
              variant: 'success',
            });
            setActiveSvap(undefined);
            display('svaps.viewall.disabled');
            hide('svaps.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveSvap(payload);
        setErrors([]);
        display('svaps.viewall');
        hide('svaps.viewall.disabled');
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
              display('svaps.viewall.disabled');
              hide('svaps.viewall');
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
              display('svaps.viewall.disabled');
              hide('svaps.viewall');
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
        <CircularProgress />
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
};
