import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplUcdProcessEdit from './ucd-process-edit';
import ChplUcdProcessesView from './ucd-processes-view';

import {
  useDeleteUcdProcess,
  useFetchUcdProcesses,
  usePostUcdProcess,
  usePutUcdProcess,
} from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplUcdProcesses() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchUcdProcesses();
  const deleteUcdProcess = useDeleteUcdProcess();
  const postUcdProcess = usePostUcdProcess();
  const putUcdProcess = usePutUcdProcess();
  const { enqueueSnackbar } = useSnackbar();
  const [activeUcdProcess, setActiveUcdProcess] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [ucdProcesses, setUcdProcesses] = useState([]);
  let handleDispatch;

  useEffect(() => {
    append(
      <Button
        key="ucdProcesses.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        UCD Processes
      </Button>,
    );
    append(
      <Button
        key="ucdProcesses.viewall"
        depth={1}
        variant="text"
        onClick={() => handleDispatch({ action: 'cancel' })}
      >
        UCD Processes
      </Button>,
    );
    display('ucdProcesses.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setUcdProcesses(data);
  }, [data, isLoading, isSuccess]);

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveUcdProcess(undefined);
        display('ucdProcesses.viewall.disabled');
        hide('ucdProcesses.viewall');
        hide('ucdProcesses.add.disabled');
        hide('ucdProcesses.edit.disabled');
        break;
      case 'delete':
        setErrors([]);
        deleteUcdProcess.mutate(payload, {
          onSuccess: () => {
            enqueueSnackbar('UCD Process Deleted', {
              variant: 'success',
            });
            setActiveUcdProcess(undefined);
            display('ucdProcesses.viewall.disabled');
            hide('ucdProcesses.viewall');
          },
          onError: (error) => {
            setErrors(error.response.data.errorMessages);
          },
        });
        break;
      case 'edit':
        setActiveUcdProcess(payload);
        setErrors([]);
        display('ucdProcesses.viewall');
        hide('ucdProcesses.viewall.disabled');
        break;
      case 'save':
        setErrors([]);
        if (payload.id) {
          putUcdProcess.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('UCD Process Updated', {
                variant: 'success',
              });
              setActiveUcdProcess(undefined);
              display('ucdProcesses.viewall.disabled');
              hide('ucdProcesses.viewall');
            },
            onError: (error) => {
              setErrors(error.response.data.errorMessages);
            },
          });
        } else {
          postUcdProcess.mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar('UCD Process Created', {
                variant: 'success',
              });
              setActiveUcdProcess(undefined);
              display('ucdProcesses.viewall.disabled');
              hide('ucdProcesses.viewall');
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

  if (activeUcdProcess) {
    return (
      <Card>
        <CardHeader title={`${activeUcdProcess.id ? 'Edit' : 'Add'} UCD Process`} />
        <CardContent>
          <ChplUcdProcessEdit
            ucdProcess={activeUcdProcess}
            dispatch={handleDispatch}
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
      <CardHeader title="UCD Processes" />
      <CardContent>
        { (deleteUcdProcess.isLoading || postUcdProcess.isLoading || putUcdProcess.isLoading)
          && (
            <CircularProgress />
          )}
        <ChplUcdProcessesView
          ucdProcesses={ucdProcesses}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplUcdProcesses;

ChplUcdProcesses.propTypes = {
};
