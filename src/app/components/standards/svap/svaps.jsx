import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
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
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="svaps.viewall.disabled"
        depth={1}
        variant="text"
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

  if (activeSvap) {
    return (
      <Card>
        <CardHeader title={`${activeSvap.svapId ? 'Edit' : 'Add'} SVAP`} />
        <CardContent>
          <ChplSvapEdit
            svap={activeSvap}
            dispatch={handleDispatch}
            criterionOptions={criterionOptions}
            errors={errors}
          />
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="SVAP Maintenance" />
      <CardContent>
        { (deleteSvap.isLoading || postSvap.isLoading || putSvap.isLoading)
          && (
            <CircularProgress />
          )}
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
